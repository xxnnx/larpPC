
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getMyBookings,
  getZones,
  getResources,
  createCancellationRequest,
  getMyCancellationRequests,
  apiError
} from '../../api/bookingApi';
import { displayDateTime, money } from '../../utils/booking';
import './Profile.css';
import WalletPanel from '@/features/wallet/WalletPanel';
import './ProfileDashboard.css';

const statuses = {
  ACTIVE: 'Активно',
  CANCELLED: 'Отменено',
  COMPLETED: 'Завершено'
};

const requestStatuses = {
  PENDING: 'Запрос на отмену',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена'
};

export default function Profile() {
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState({});
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [refresh, setRefresh] = useState(0);
  const [submitting, setSubmitting] = useState(null);

  const [requestBookingId, setRequestBookingId] = useState(null);
  const [reason, setReason] = useState('');

  const cancelLock = useRef(false);

  useEffect(() => {
    const update = () => {
      if (document.visibilityState === 'visible' && !cancelLock.current) {
        setRefresh(value => value + 1);
      }
    };

    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const [bookingsData, requestsData] = await Promise.all([
          getMyBookings(controller.signal),
          getMyCancellationRequests(controller.signal)
        ]);

        if (!controller.signal.aborted) {
          setBookings(bookingsData);
          setRequests(requestsData);
          setError('');
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(apiError(err));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    getZones(controller.signal)
      .then(async rooms => {
        const results = await Promise.allSettled(
          rooms.map(async room =>
            (await getResources(room.id, controller.signal)).map(pc => [
              pc.id,
              {
                name: pc.name || 'Место ' + pc.number,
                room: room.name
              }
            ])
          )
        );

        if (!controller.signal.aborted) {
          setPlaces(
            Object.fromEntries(
              results
                .filter(result => result.status === 'fulfilled')
                .flatMap(result => result.value)
            )
          );
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [refresh, user?.id]);

  async function submitCancellationRequest(bookingId) {
    if (cancelLock.current) return;

    cancelLock.current = true;
    setSubmitting(bookingId);
    setError('');
    setNotice('');

    try {
      await createCancellationRequest(bookingId, reason.trim());

      setNotice(
        'Заявка на отмену бронирования №' +
        bookingId +
        ' отправлена. Ожидай решения администратора.'
      );

      setRequestBookingId(null);
      setReason('');

      setRefresh(value => value + 1);
    } catch (err) {
      setError(apiError(err, 'Не удалось отправить заявку.'));
    } finally {
      cancelLock.current = false;
      setSubmitting(null);
    }
  }

  if (!user) return null;

  const active = bookings
    .filter(item => item.status === 'ACTIVE')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const history = bookings
    .filter(item => item.status !== 'ACTIVE')
    .sort((a, b) => b.startTime.localeCompare(a.startTime));

  function getRequest(bookingId) {
    return requests.find(request => request.bookingId === bookingId);
  }

  function card(booking) {
    const place = places[booking.computerId];
    const cancellationRequest = getRequest(booking.id);

    const hasPendingRequest =
      cancellationRequest?.status === 'PENDING';

    const canRequestCancellation =
      booking.status === 'ACTIVE' &&
      !hasPendingRequest;

    return (
      <article className="booking-card" key={booking.id}>
        <div className="booking-card__main">
          <div className="booking-card__number">
            #{booking.id}
          </div>

          <div className="booking-card__info">
            <span className="booking-card__zone">
              {place?.room || 'Игровое место'}
            </span>

            <h3>
              {place?.name || 'Место #' + booking.computerId}
            </h3>

            <p>
              {booking.tariffName || 'Тариф #' + booking.tariffId}
            </p>

            <p>
              {displayDateTime(booking.startTime)} —{' '}
              {displayDateTime(booking.endTime)} (МСК)
            </p>
          </div>
        </div>

        <div className="booking-card__side">
          <span className="booking-card__status">
            {statuses[booking.status] || booking.status}
          </span>

          <strong>{money(booking.priceAtBooking)}</strong>

          {cancellationRequest && (
            <div className="profile-cancellation-status">
              <strong>
                {requestStatuses[cancellationRequest.status] ||
                  cancellationRequest.status}
              </strong>

              <p>
                Причина: {cancellationRequest.reason || 'не указана'}
              </p>

              {cancellationRequest.adminComment && (
                <p>
                  Комментарий администратора:{' '}
                  {cancellationRequest.adminComment}
                </p>
              )}
            </div>
          )}

          {canRequestCancellation && (
            requestBookingId === booking.id ? (
              <div className="profile-confirm">
                <p>
                  При желании укажи причину отмены. Заявку рассмотрит администратор.
                  Возврат средств произойдёт только после одобрения.
                  Подать заявку можно не позднее чем за 1 час до начала
                  бронирования.
                </p>

                <textarea
                  value={reason}
                  onChange={event => setReason(event.target.value)}
                  placeholder="Причина отмены (необязательно)..."
                  maxLength={1000}
                  rows={4}
                  disabled={submitting !== null}
                />

                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => submitCancellationRequest(booking.id)}
                >
                  {submitting === booking.id
                    ? 'Отправляем…'
                    : 'Отправить заявку'}
                </button>

                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => {
                    setRequestBookingId(null);
                    setReason('');
                    setError('');
                  }}
                >
                  Назад
                </button>
              </div>
            ) : (
              <button
                className="booking-card__cancel"
                type="button"
                disabled={submitting !== null || loading}
                onClick={() => {
                  const cancellationDeadline =
                    new Date(booking.startTime).getTime() - 60 * 60 * 1000;
                  const cancellationExpired = Date.now() > cancellationDeadline;

                  if (cancellationExpired) {
                    setError(
                      'Бронь можно отменить не позднее чем за 1 час до начала.'
                    );
                    setNotice('');
                    return;
                  }
                  setRequestBookingId(booking.id);
                  setReason('');
                  setError('');
                  setNotice('');
                }}
              >
                Запросить отмену
              </button>
            )
          )}
        </div>
      </article>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <header className="profile-header">
          <Link to="/" className="profile-header__logo">
            <span>GAMESENSE</span>
            <small>ТВОЁ МЕСТО. ТВОЯ ИГРА.</small>
          </Link>

          <nav className="profile-header__navigation">
            <Link to="/">ГЛАВНАЯ</Link>
            <a href="#upcoming">БРОНИРОВАНИЯ</a>
            <a href="#history">ИСТОРИЯ</a>
          </nav>

          <div className="profile-header__user">
            <div className="profile-header__avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-header__user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <button
              type="button"
              className="profile-header__logout"
              onClick={logout}
            >
              ВЫЙТИ
            </button>
          </div>
        </header>

        <section className="profile-page__hero">
          <div>
            <span className="profile-page__eyebrow">
              ЛИЧНЫЙ КАБИНЕТ
            </span>

            <h1 className="profile-page__title">
              Привет, {user.name}
            </h1>

            <p>
              Твои бронирования и история посещений.
            </p>
          </div>

          <Link to="/booking" className="profile-page__book">
            Забронировать место +
          </Link>
        </section>

        <WalletPanel />


        {loading && (
          <p role="status">Загружаем бронирования…</p>
        )}

        {error && (
          <p
            className="auth-feedback auth-feedback--error"
            role="alert"
          >
            {error}
          </p>
        )}

        {notice && (
          <p className="auth-feedback" role="status">
            {notice}
          </p>
        )}

        <section className="profile-section" id="upcoming">
          <div className="profile-section__header">
            <h2>Твои бронирования <span className="profile-count">{active.length}</span></h2>
            <button type="button" className="profile-refresh" disabled={loading || submitting !== null} onClick={() => setRefresh(value => value + 1)}>Обновить</button>
          </div>

          {!loading && !error && !active.length && (
            <div className="profile-empty">
              <span className="profile-empty__symbol" aria-hidden="true">＋</span>
              <h3>Время для новой игры</h3>
              <p>Выбери зал, удобное время и своё место. Бронь появится здесь.</p>
              <Link to="/booking">Выбрать место <span aria-hidden="true">↗</span></Link>
            </div>
          )}

          <div className="profile-bookings">
            {active.map(card)}
          </div>
        </section>

        <section className="profile-section" id="history">
          <div className="profile-section__header">
            <h2>История посещений <span className="profile-count">{history.length}</span></h2>
          </div>

          {!loading && !error && !history.length && (
            <p>
              Здесь появятся завершённые и отменённые бронирования.
            </p>
          )}

          <div className="profile-bookings">
            {history.map(card)}
          </div>
        </section>
      </div>
    </main>
  );
}
