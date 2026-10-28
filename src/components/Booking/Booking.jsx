import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SeatMap from '../SeatMap/SeatMap';
import { getZones, getResources, getTariffs, createBooking, apiError } from '../../api/bookingApi';
import { clubDateTime, bookingDate, endDateTime, displayDateTime, displayDuration, matchRoom, money } from '../../utils/booking';
import './Booking.css';

function Step({ number, title, children }) {
  return <section className="booking__step">
    <div className="booking__step-header"><span className="booking__step-number">{number}</span><h2>{title}</h2></div>
    {children}
  </section>;
}

export default function Booking() {
  const [params] = useSearchParams();
  const hint = params.get('room') || params.get('zone');
  const tariffHint = params.get('tariff');
  const durationHint = Number(params.get('duration'));
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [catalog, setCatalog] = useState({ roomId: '', computers: [], tariffs: [] });
  const [computerId, setComputerId] = useState('');
  const [tariffId, setTariffId] = useState('');
  const [start, setStart] = useState('');
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const submitLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingRooms(true);
    setLoadError('');
    getZones(controller.signal).then(data => {
      setRooms(data);
      setRoomId(String(matchRoom(data, hint)?.id || ''));
    }).catch(err => { if (!controller.signal.aborted) setLoadError(apiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoadingRooms(false); });
    return () => controller.abort();
  }, [hint, retry]);

  useEffect(() => {
    const controller = new AbortController();
    setComputerId('');
    setTariffId('');
    if (!roomId) return () => controller.abort();
    setLoadingPlaces(true);
    setLoadError('');
    Promise.all([getResources(roomId, controller.signal), getTariffs(roomId, controller.signal)])
      .then(([computers, allTariffs]) => {
        const tariffs = allTariffs.filter(item => item.active && ['HOURLY', 'PACKAGE'].includes(item.tariffType));
        setCatalog({ roomId, computers, tariffs });
        const selected = tariffs.find(item => String(item.id) === tariffHint)
          || tariffs.find(item => item.tariffType === 'PACKAGE' && item.durationMinutes === durationHint * 60);
        setTariffId(selected ? String(selected.id) : '');
        const hintedMinutes = durationHint * 60;
        const validHint = Number.isInteger(hintedMinutes) && hintedMinutes >= 30 && hintedMinutes <= 525600 && hintedMinutes % 30 === 0;
        setHours(validHint ? Math.floor(hintedMinutes / 60) : 1);
        setMinutes(validHint ? hintedMinutes % 60 : 0);
      }).catch(err => { if (!controller.signal.aborted) setLoadError(apiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoadingPlaces(false); });
    return () => controller.abort();
  }, [roomId, tariffHint, durationHint, retry]);

  const { computers, tariffs } = catalog.roomId === roomId ? catalog : { computers: [], tariffs: [] };
  const tariff = tariffs.find(item => String(item.id) === tariffId);
  const computer = computers.find(item => String(item.id) === String(computerId));
  const duration = tariff?.tariffType === 'PACKAGE' ? Number(tariff.durationMinutes) : Number(hours) * 60 + Number(minutes);
  const validTime = start && Number.isFinite(bookingDate(start).getTime()) && bookingDate(start) > new Date();
  const validDuration = Number.isInteger(duration) && duration > 0 && duration <= 525600
    && (tariff?.tariffType === 'PACKAGE' || (duration >= 30 && duration % 30 === 0));
  const end = start && validDuration && Number.isFinite(bookingDate(start).getTime()) ? endDateTime(start, duration) : '';
  const price = tariff ? Number(tariff.price) * (tariff.tariffType === 'PACKAGE' ? 1 : duration / 60) : 0;
  const ready = computer?.status === 'AVAILABLE' && tariff && validTime && validDuration && !loadingPlaces && !loadError;

  async function submit(event) {
    event.preventDefault();
    if (submitLock.current) return;
    setError('');
    if (!ready) { setError('Выбери место, тариф и время в будущем.'); return; }
    submitLock.current = true;
    setSubmitting(true);
    try {
      const booking = await createBooking({
        computerId: computer.id, tariffId: tariff.id,
        startTime: start + ':00', endTime: end,
      });
      setCreated(booking);
    } catch (err) {
      setError(!err.response && err.request
        ? 'Ответ сервера не получен. Бронь могла сохраниться: проверь личный кабинет перед повторной отправкой.'
        : apiError(err, 'Не удалось создать бронирование.'));
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return <main className="booking-page"><div className="booking-page__container">
    <Link to="/" className="booking-page__back">← На главную</Link>
    <div className="booking-page__header"><span className="booking-page__eyebrow">GAMESENSE</span><h1 className="booking-page__title">БРОНИРОВАНИЕ</h1></div>
    {created ? <section className="booking" role="status">
      <h2>Бронь №{created.id} создана</h2>
      <p>{displayDateTime(created.startTime)} — {displayDateTime(created.endTime)}</p>
      <p>{created.tariffName} · {money(created.priceAtBooking)}</p>
      <Link className="hero__button" to="/profile">Мои бронирования →</Link>
      <button type="button" className="booking__action" onClick={() => { setCreated(null); setStart(''); }}>Новая бронь</button>
    </section> : <>
      {loadError && <div className="booking__message" role="alert">{loadError} <button type="button" onClick={() => setRetry(value => value + 1)}>Повторить загрузку</button></div>}
      <form className="booking" onSubmit={submit} aria-busy={submitting}>
        <fieldset className="booking__fieldset" disabled={submitting}>
          <Step number="01" title="ВЫБЕРИ ЗАЛ">
            {loadingRooms ? <p role="status">Загружаем залы…</p> : !loadError && !rooms.length ? <p>Залы пока не добавлены. Обратись к администратору клуба.</p> :
              <div className="booking__zones">{rooms.map(room => <button type="button" key={room.id} aria-pressed={roomId === String(room.id)}
                className={'booking__zone ' + (roomId === String(room.id) ? 'booking__zone--active' : '')}
                onClick={() => { setRoomId(String(room.id)); setError(''); }}>
                <span>{room.name}</span><small>{room.description}</small>
              </button>)}</div>}
          </Step>
          <Step number="02" title="ВЫБЕРИ МЕСТО">
            {!roomId ? <p>Сначала выбери зал.</p> : loadingPlaces ? <p role="status">Загружаем места и тарифы…</p> :
              !computers.length ? <p>Места в этом зале пока не добавлены.</p> :
                <SeatMap computers={computers} selectedSeat={computerId} onSelect={setComputerId} />}
            <p className="booking__notice">Доступность выбранного времени проверим при отправке брони.</p>
          </Step>
          <Step number="03" title="ВЫБЕРИ ТАРИФ">
            {!tariffs.length ? <p>Выбери зал с доступными тарифами.</p> : <div className="booking__zones">{tariffs.map(item =>
              <button type="button" key={item.id} aria-pressed={tariffId === String(item.id)}
                className={'booking__zone ' + (tariffId === String(item.id) ? 'booking__zone--active' : '')}
                onClick={() => setTariffId(String(item.id))}>
                <span>{item.name}</span><small>{money(item.price)} / {item.tariffType === 'PACKAGE' ? displayDuration(item.durationMinutes) : 'час'}</small>
              </button>)}</div>}
          </Step>
          <Step number="04" title="ДАТА И ВРЕМЯ">
            <label className="booking__field">Начало сеанса (московское время)
              <input type="datetime-local" className="booking__date-picker" value={start} min={clubDateTime()} step="60" required onChange={event => setStart(event.target.value)} />
            </label>
            {tariff?.tariffType === 'PACKAGE' ? <p>Длительность пакета: {displayDuration(duration)}</p> :
              <div className="booking__duration" role="group" aria-label="Длительность сеанса">
                <label>Часы<input type="number" value={hours} min="0" max="8760" step="1" required onChange={event => setHours(event.target.value)} /></label>
                <label>Минуты<select value={minutes} onChange={event => setMinutes(event.target.value)}><option value="0">00</option><option value="30">30</option></select></label>
                <span>{validDuration ? `Итого: ${displayDuration(duration)}` : 'Минимум 30 минут'}</span>
              </div>}
            {end && <p>Окончание: {displayDateTime(end)}</p>}
          </Step>
          {error && <p className="booking__message" role="alert">{error} <Link to="/profile">Мои бронирования</Link></p>}
          <div className="booking__summary"><div className="booking__summary-info"><span>Предварительная стоимость</span><strong>{tariff && validDuration ? money(price) : '—'}</strong></div>
            <button type="submit" className="booking__submit" disabled={!ready || submitting}>{submitting ? 'СОЗДАЁМ БРОНЬ…' : 'ЗАБРОНИРОВАТЬ'}</button>
          </div>
        </fieldset>
      </form>
    </>}
  </div></main>;
}
