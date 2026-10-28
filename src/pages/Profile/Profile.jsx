import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings, getZones, getResources, cancelBooking, apiError } from '../../api/bookingApi';
import { displayDateTime, money } from '../../utils/booking';
import './Profile.css';

const statuses = { ACTIVE: 'Активно', CANCELLED: 'Отменено', COMPLETED: 'Завершено' };

export default function Profile() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [cancelling, setCancelling] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const cancelLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getMyBookings(controller.signal).then(setBookings)
      .catch(err => { if (!controller.signal.aborted) setError(apiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    // Missing catalogue names must not hide the user's bookings.
    getZones(controller.signal).then(async rooms => {
      const results = await Promise.allSettled(rooms.map(async room =>
        (await getResources(room.id, controller.signal)).map(pc => [pc.id, { name: pc.name || 'Место ' + pc.number, room: room.name }])
      ));
      if (!controller.signal.aborted) setPlaces(Object.fromEntries(results.filter(result => result.status === 'fulfilled').flatMap(result => result.value)));
    }).catch(() => {});
    return () => controller.abort();
  }, [refresh, user?.id]);

  async function cancel(id) {
    if (cancelLock.current) return;
    cancelLock.current = true;
    setCancelling(id);
    setError('');
    setNotice('');
    try {
      await cancelBooking(id);
      setBookings(items => items.map(item => item.id === id ? { ...item, status: 'CANCELLED' } : item));
      setNotice('Бронь №' + id + ' отменена.');
      setConfirmId(null);
    } catch (err) {
      setError(apiError(err, 'Не удалось отменить бронь.'));
    } finally {
      cancelLock.current = false;
      setCancelling(null);
    }
  }

  if (!user) return null;
  const active = bookings.filter(item => item.status === 'ACTIVE').sort((a, b) => a.startTime.localeCompare(b.startTime));
  const history = bookings.filter(item => item.status !== 'ACTIVE').sort((a, b) => b.startTime.localeCompare(a.startTime));

  function card(booking) {
    const place = places[booking.computerId];
    return <article className="booking-card" key={booking.id}>
      <div className="booking-card__main">
        <div className="booking-card__number">#{booking.id}</div>
        <div className="booking-card__info">
          <span className="booking-card__zone">{place?.room || 'Игровое место'}</span>
          <h3>{place?.name || 'Место #' + booking.computerId}</h3>
          <p>{booking.tariffName || 'Тариф #' + booking.tariffId}</p>
          <p>{displayDateTime(booking.startTime)} — {displayDateTime(booking.endTime)} (МСК)</p>
        </div>
      </div>
      <div className="booking-card__side">
        <span className="booking-card__status">{statuses[booking.status] || booking.status}</span>
        <strong>{money(booking.priceAtBooking)}</strong>
        {booking.status === 'ACTIVE' && (confirmId === booking.id ? <div className="profile-confirm">
          <p>Отменить эту бронь?</p>
          <button type="button" disabled={cancelling !== null} onClick={() => cancel(booking.id)}>{cancelling === booking.id ? 'Отменяем…' : 'Да, отменить'}</button>
          <button type="button" disabled={cancelling !== null} onClick={() => setConfirmId(null)}>Оставить</button>
        </div> : <button className="booking-card__cancel" type="button" disabled={cancelling !== null || loading} onClick={() => setConfirmId(booking.id)}>ОТМЕНИТЬ</button>)}
      </div>
    </article>;
  }

  return <main className="profile-page"><div className="profile-page__container">
    <header className="profile-header">
      <Link to="/" className="profile-header__logo"><span>GAMESENSE</span><small>ТВОЁ МЕСТО. ТВОЯ ИГРА.</small></Link>
      <nav className="profile-header__navigation"><Link to="/">ГЛАВНАЯ</Link><a href="#upcoming">БРОНИРОВАНИЯ</a><a href="#history">ИСТОРИЯ</a></nav>
      <div className="profile-header__user"><div className="profile-header__avatar">{user.name?.charAt(0).toUpperCase()}</div>
        <div className="profile-header__user-info"><strong>{user.name}</strong><span>{user.email}</span></div>
        <button type="button" className="profile-header__logout" onClick={logout}>ВЫЙТИ</button>
      </div>
    </header>
    <section className="profile-page__hero"><div><span className="profile-page__eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
      <h1 className="profile-page__title">ПРИВЕТ, {user.name?.toUpperCase()}</h1><p>Твои бронирования и история посещений.</p></div>
      <Link to="/booking" className="profile-page__book">НОВАЯ БРОНЬ +</Link>
    </section>
    <button type="button" className="profile-refresh" disabled={loading || cancelling !== null} onClick={() => setRefresh(value => value + 1)}>Обновить бронирования</button>
    {loading && <p role="status">Загружаем бронирования…</p>}
    {error && <p className="auth-feedback auth-feedback--error" role="alert">{error}</p>}
    {notice && <p className="auth-feedback" role="status">{notice}</p>}
    <section className="profile-section" id="upcoming"><div className="profile-section__header"><h2>АКТИВНЫЕ БРОНИРОВАНИЯ</h2></div>
      {!loading && !error && !active.length && <p>Активных бронирований пока нет. Выбери место для следующей игры.</p>}
      <div className="profile-bookings">{active.map(card)}</div>
    </section>
    <section className="profile-section" id="history"><div className="profile-section__header"><h2>ИСТОРИЯ БРОНИРОВАНИЙ</h2></div>
      {!loading && !error && !history.length && <p>Здесь появятся завершённые и отменённые бронирования.</p>}
      <div className="profile-bookings">{history.map(card)}</div>
    </section>
  </div></main>;
}
