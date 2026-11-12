
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SeatMap from '../SeatMap/SeatMap';
import {
  getZones,
  getResources,
  getTariffs,
  createBooking,
  getAvailableComputers,
  apiError,
} from '../../api/bookingApi';
import {
  clubDateTime,
  bookingDate,
  endDateTime,
  displayDateTime,
  displayDuration,
  matchRoom,
  money,
} from '../../utils/booking';
import './Booking.css';
import { useWallet } from '@/entities/wallet/useWallet';

function Step({ number, title, children }) {
  return (
    <section className="booking__step">
      <div className="booking__step-header">
        <span className="booking__step-number">{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function Booking() {
  const wallet = useWallet();
  const [params] = useSearchParams();

  const hint = params.get('room') || params.get('zone');
  const tariffHint = params.get('tariff');
  const durationHint = Number(params.get('duration'));

  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');

  const [catalog, setCatalog] = useState({
    roomId: '',
    computers: [],
    tariffs: [],
  });

  const [computerId, setComputerId] = useState('');
  const [tariffId, setTariffId] = useState('');
  const [start, setStart] = useState('');
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [error, setError] = useState('');

  const [retry, setRetry] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const [availableComputerIds, setAvailableComputerIds] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const submitLock = useRef(false);

  // 1. Загрузка залов
  useEffect(() => {
    const controller = new AbortController();

    async function fetchRooms() {
      setLoadingRooms(true);
      setLoadError('');

      try {
        const data = await getZones(controller.signal);

        setRooms(data);
        setRoomId(String(matchRoom(data, hint)?.id || ''));
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoadError(apiError(err));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRooms(false);
        }
      }
    }

    fetchRooms();

    return () => controller.abort();
  }, [hint, retry]);

  // 2. Загрузка компьютеров и тарифов выбранного зала
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPlaces() {
      setComputerId('');
      setTariffId('');
      setAvailableComputerIds(null);
      setAvailabilityError('');

      if (!roomId) {
        setCatalog({ roomId: '', computers: [], tariffs: [] });
        setLoadingPlaces(false);
        return;
      }

      setLoadingPlaces(true);
      setLoadError('');

      try {
        const [computers, allTariffs] = await Promise.all([
          getResources(roomId, controller.signal),
          getTariffs(roomId, controller.signal),
        ]);

        if (controller.signal.aborted) return;

        const tariffs = allTariffs.filter(item =>
          item.active &&
          ['HOURLY', 'PACKAGE'].includes(item.tariffType)
        );

        setCatalog({ roomId, computers, tariffs });

        const selected =
          tariffs.find(item => String(item.id) === tariffHint) ||
          tariffs.find(
            item =>
              item.tariffType === 'PACKAGE' &&
              item.durationMinutes === durationHint * 60
          );

        setTariffId(selected ? String(selected.id) : '');

        const hintedMinutes = durationHint * 60;

        const validHint =
          Number.isInteger(hintedMinutes) &&
          hintedMinutes >= 30 &&
          hintedMinutes <= 525600 &&
          hintedMinutes % 30 === 0;

        setHours(validHint ? Math.floor(hintedMinutes / 60) : 1);
        setMinutes(validHint ? hintedMinutes % 60 : 0);
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoadError(apiError(err));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPlaces(false);
        }
      }
    }

    fetchPlaces();

    return () => controller.abort();
  }, [roomId, tariffHint, durationHint, retry]);

  // Данные выбранного зала
  const { computers, tariffs } =
    catalog.roomId === roomId
      ? catalog
      : { computers: [], tariffs: [] };

  const tariff = tariffs.find(item => String(item.id) === tariffId);

  const computer = computers.find(
    item => String(item.id) === String(computerId)
  );

  // Расчёт продолжительности
  const duration =
    tariff?.tariffType === 'PACKAGE'
      ? Number(tariff.durationMinutes)
      : Number(hours) * 60 + Number(minutes);

  // Проверка даты и продолжительности
  const parsedStart = start ? bookingDate(start) : null;

  const validTime =
    Boolean(start) &&
    parsedStart &&
    Number.isFinite(parsedStart.getTime()) &&
    parsedStart > new Date();

  const validDuration =
    Number.isInteger(duration) &&
    duration > 0 &&
    duration <= 525600 &&
    (
      tariff?.tariffType === 'PACKAGE' ||
      (duration >= 30 && duration % 30 === 0)
    );

  const end =
    start && validDuration && parsedStart &&
    Number.isFinite(parsedStart.getTime())
      ? endDateTime(start, duration)
      : '';

  // Расчёт стоимости
  const price = tariff
    ? Number(tariff.price) *
      (tariff.tariffType === 'PACKAGE' ? 1 : duration / 60)
    : 0;

  const roundedPrice =
    Math.round((price + Number.EPSILON) * 100) / 100;

  const enoughFunds =
    wallet.balance !== null &&
    wallet.balance >= roundedPrice;

  // 3. Проверка свободных компьютеров на выбранный интервал
  useEffect(() => {
    const controller = new AbortController();

    async function checkAvailability() {
      setComputerId('');
      setAvailableComputerIds(null);
      setAvailabilityError('');

      const canCheck =
        roomId &&
        tariffId &&
        validTime &&
        validDuration &&
        end &&
        !loadingPlaces &&
        !loadError;

      if (!canCheck) {
        setCheckingAvailability(false);
        return;
      }

      setCheckingAvailability(true);

      try {
        const freeComputers = await getAvailableComputers(
          roomId,
          tariffId,
          start,
          end,
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (!Array.isArray(freeComputers)) {
          throw new Error('Сервер вернул некорректный список компьютеров');
        }

        setAvailableComputerIds(
          freeComputers.map(item => String(item.id))
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          setAvailableComputerIds(null);
          setAvailabilityError(apiError(err, 'Не удалось проверить доступность компьютеров.'));
        }
      } finally {
        if (!controller.signal.aborted) {
          setCheckingAvailability(false);
        }
      }
    }

    checkAvailability();

    return () => controller.abort();
  }, [
    roomId,
    tariffId,
    start,
    end,
    validTime,
    validDuration,
    loadingPlaces,
    loadError,
  ]);

  // Проверка выбранного компьютера
  const isSeatAvailable =
    availableComputerIds !== null &&
    availableComputerIds.includes(String(computerId));

  // Условия для создания бронирования
  const ready =
    computer?.status === 'AVAILABLE' &&
    isSeatAvailable &&
    Boolean(computerId) &&
    Boolean(tariff) &&
    validTime &&
    validDuration &&
    !loadingPlaces &&
    !checkingAvailability &&
    !availabilityError &&
    !loadError;

  // 4. Создание бронирования
  async function submit(event) {
    event.preventDefault();

    if (submitLock.current) return;

    setError('');

    if (!ready) {
      setError('Выбери свободное место, тариф и время в будущем.');
      return;
    }

    if (wallet.loading || wallet.error || !enoughFunds) {
      setError('Проверь баланс и пополни его у администратора клуба.');
      return;
    }

    submitLock.current = true;
    setSubmitting(true);

    try {
      const booking = await createBooking({
        computerId: computer.id,
        tariffId: tariff.id,
        startTime: start + ':00',
        endTime: end,
      });

      setCreated(booking);
      wallet.refresh();
    } catch (err) {
      wallet.refresh();

      setError(
        !err.response && err.request
          ? 'Ответ сервера не получен. Бронь могла сохраниться: проверь личный кабинет перед повторной отправкой.'
          : apiError(err, 'Не удалось создать бронирование.')
      );
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="booking-page">
      <div className="booking-page__container">
        <Link to="/" className="booking-page__back">
          ← На главную
        </Link>

        <div className="booking-page__header">
          <span className="booking-page__eyebrow">GAMESENSE</span>
          <h1 className="booking-page__title">БРОНИРОВАНИЕ</h1>
        </div>

        {created ? (
          <section className="booking" role="status">
            <h2>Бронь №{created.id} создана</h2>
            <p>
              {displayDateTime(created.startTime)} —{' '}
              {displayDateTime(created.endTime)}
            </p>
            <p>
              {created.tariffName} · Списано с баланса:{' '}
              {money(created.priceAtBooking)}
            </p>

            <Link className="hero__button" to="/profile">
              Мои бронирования →
            </Link>

            <button
              type="button"
              className="booking__action"
              onClick={() => {
                setCreated(null);
                setStart('');
                setComputerId('');
                setAvailableComputerIds(null);
              }}
            >
              Новая бронь
            </button>
          </section>
        ) : (
          <>
            {loadError && (
              <div className="booking__message" role="alert">
                {loadError}{' '}
                <button
                  type="button"
                  onClick={() => setRetry(value => value + 1)}
                >
                  Повторить
                </button>
              </div>
            )}

            <form
              className="booking"
              onSubmit={submit}
              aria-busy={submitting}
            >
              <fieldset
                className="booking__fieldset"
                disabled={submitting}
              >
                
                <Step number="01" title="ВЫБЕРИ ЗАЛ">
                  {loadingRooms ? (
                    <p role="status">Загружаем залы…</p>
                  ) : !loadError && !rooms.length ? (
                    <p>Залы пока не добавлены.</p>
                  ) : (
                    <div className="booking__zones">
                      {rooms.map(room => (
                        <button
                          type="button"
                          key={room.id}
                          aria-pressed={roomId === String(room.id)}
                          className={
                            'booking__zone ' +
                            (roomId === String(room.id)
                              ? 'booking__zone--active'
                              : '')
                          }
                          onClick={() => {
                            setRoomId(String(room.id));
                            setError('');
                          }}
                        >
                          <span>{room.name}</span>
                          <small>{room.description}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </Step>

                
                <Step number="02" title="ВЫБЕРИ ТАРИФ">
                  {!roomId ? (
                    <p>Сначала выбери зал.</p>
                  ) : loadingPlaces ? (
                    <p role="status">Загружаем тарифы…</p>
                  ) : !tariffs.length ? (
                    <p>В этом зале нет доступных тарифов.</p>
                  ) : (
                    <div className="booking__zones">
                      {tariffs.map(item => (
                        <button
                          type="button"
                          key={item.id}
                          aria-pressed={tariffId === String(item.id)}
                          className={
                            'booking__zone ' +
                            (tariffId === String(item.id)
                              ? 'booking__zone--active'
                              : '')
                          }
                          onClick={() => {
                            setTariffId(String(item.id));
                            setError('');
                          }}
                        >
                          <span>{item.name}</span>
                          <small>
                            {money(item.price)} /{' '}
                            {item.tariffType === 'PACKAGE'
                              ? displayDuration(item.durationMinutes)
                              : 'час'}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </Step>

                
                <Step number="03" title="ДАТА И ВРЕМЯ">
                  {!tariffId ? (
                    <p>Сначала выбери тариф.</p>
                  ) : (
                    <>
                      <label className="booking__field">
                        Начало сеанса (московское время)
                        <input
                          type="datetime-local"
                          className="booking__date-picker"
                          value={start}
                          min={clubDateTime()}
                          step="60"
                          required
                          onChange={event => {
                            setStart(event.target.value);
                            setError('');
                          }}
                        />
                      </label>

                      {tariff?.tariffType === 'PACKAGE' ? (
                        <p>
                          Длительность пакета: {displayDuration(duration)}
                        </p>
                      ) : (
                        <div
                          className="booking__duration"
                          role="group"
                          aria-label="Длительность сеанса"
                        >
                          <label>
                            Часы
                            <input
                              type="number"
                              value={hours}
                              min="0"
                              max="8760"
                              step="1"
                              required
                              onChange={event =>
                                setHours(event.target.value)
                              }
                            />
                          </label>

                          <label>
                            Минуты
                            <select
                              value={minutes}
                              onChange={event =>
                                setMinutes(event.target.value)
                              }
                            >
                              <option value="0">00</option>
                              <option value="30">30</option>
                            </select>
                          </label>

                          <span>
                            {validDuration
                              ? `Итого: ${displayDuration(duration)}`
                              : 'Минимум 30 минут'}
                          </span>
                        </div>
                      )}

                      {end && (
                        <p>Окончание: {displayDateTime(end)}</p>
                      )}
                    </>
                  )}
                </Step>

                
                <Step number="04" title="ВЫБЕРИ МЕСТО">
                  {!start || !validDuration || !validTime ? (
                    <p style={{ color: 'var(--text-muted, gray)' }}>
                      Заполни дату и время, чтобы увидеть свободные места.
                    </p>
                  ) : checkingAvailability ? (
                    <p role="status">
                      Проверяем свободные ПК…
                    </p>
                  ) : availabilityError ? (
                    <p role="alert" style={{ color: 'var(--error-color, #d32f2f)' }}>
                      {availabilityError}
                    </p>
                  ) : availableComputerIds === null ? (
                    <p role="status">
                      Ожидаем проверку доступности компьютеров…
                    </p>
                  ) : availableComputerIds.length === 0 ? (
                    <p role="alert" style={{ color: 'var(--error-color, #d32f2f)' }}>
                      На выбранное время свободных мест нет. Попробуй изменить время начала.
                    </p>
                  ) : (
                    <>
                      <SeatMap
                        computers={computers}
                         selectedSeat={computerId}
                        onSelect={setComputerId}
                        availableComputerIds={availableComputerIds}
                      />

                      {!computerId && (
                        <p
                          style={{
                            color: 'var(--primary-color, #a855f7)',
                            marginTop: '10px',
                          }}
                        >
                          Выбери один из свободных ПК на карте.
                        </p>
                      )}
                    </>
                  )}
                </Step>

                
                <Step number="05" title="ОПЛАТА С БАЛАНСА">
                  {wallet.loading ? (
                    <p role="status">Загружаем баланс…</p>
                  ) : wallet.error ? (
                    <p role="alert">{wallet.error}</p>
                  ) : (
                    <>
                      <p>
                        На балансе: <strong>{money(wallet.balance)}</strong>
                      </p>

                      {tariff && validDuration &&
                        (enoughFunds ? (
                          <p>
                            После оплаты останется примерно{' '}
                            {money(wallet.balance - roundedPrice)}.
                          </p>
                        ) : (
                          <p
                            role="status"
                            style={{ color: 'var(--error-color, #d32f2f)' }}
                          >
                            Не хватает{' '}
                            {money(roundedPrice - wallet.balance)}.
                            Пополни баланс.
                          </p>
                        ))}
                    </>
                  )}

                  <button
                    type="button"
                    className="booking__action"
                    disabled={wallet.loading}
                    onClick={wallet.refresh}
                  >
                    Обновить баланс
                  </button>

                  <p className="booking__notice">
                    Стоимость спишется при создании брони. При отмене автоматического возврата нет.
                  </p>
                </Step>

                {error && (
                  <p className="booking__message" role="alert">
                    {error}{' '}
                    <Link to="/profile">Мои бронирования</Link>
                  </p>
                )}

                
                <div className="booking__summary">
                  <div className="booking__summary-info">
                    <span>Предварительная стоимость</span>
                    <strong>
                      {tariff && validDuration ? money(price) : '—'}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    className="booking__submit"
                    disabled={
                      !ready ||
                      submitting ||
                      wallet.loading ||
                      !!wallet.error ||
                      !enoughFunds
                    }
                  >
                    {submitting
                      ? 'ОПЛАЧИВАЕМ…'
                      : 'ОПЛАТИТЬ И ЗАБРОНИРОВАТЬ'}
                  </button>
                </div>
              </fieldset>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
