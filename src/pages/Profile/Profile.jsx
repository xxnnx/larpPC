import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();

  const upcomingBookings = [
    {
      id: 1,
      zone: 'СТАНДАРТ+',
      resource: 'ПК-07',
      date: '30.09.2026',
      time: '18:00',
      duration: 3,
      price: 600,
      status: 'Подтверждено',
    },
  ];

  const historyBookings = [
    {
      id: 2,
      zone: 'СТАНДАРТ',
      resource: 'ПК-02',
      date: '25.09.2026',
      time: '15:00',
      duration: 2,
      price: 300,
      status: 'Завершено',
    },
    {
      id: 3,
      zone: 'ПРИСТАВКА',
      resource: 'PS5-01',
      date: '20.09.2026',
      time: '20:00',
      duration: 2,
      price: 500,
      status: 'Завершено',
    },
  ];

  const handleCancel = (bookingId) => {
    console.log('Отмена бронирования:', bookingId);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <main className="profile-page">
      <div className="profile-page__container">

        {/* ШАПКА */}
        <header className="profile-header">
          <Link
            to="/"
            className="profile-header__logo"
          >
            <span>КИБЕРТЕКА</span>
            <small>НА ПРОФЕССИОНАЛЬНОМ</small>
          </Link>

          <nav className="profile-header__navigation">
            <Link to="/">
              ГЛАВНАЯ
            </Link>

            <a href="#upcoming">
              БРОНИРОВАНИЯ
            </a>

            <a href="#history">
              ИСТОРИЯ
            </a>
          </nav>

          <div className="profile-header__user">
            <div className="profile-header__avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-header__user-info">
              <strong>
                {user.name}
              </strong>

              <span>
                {user.email}
              </span>
            </div>

            <button
              type="button"
              className="profile-header__logout"
              onClick={handleLogout}
            >
              ВЫЙТИ
            </button>
          </div>
        </header>

        {/* ЗАГОЛОВОК */}
        <section className="profile-page__hero">
          <div>
            <span className="profile-page__eyebrow">
              ЛИЧНЫЙ КАБИНЕТ
            </span>

            <h1 className="profile-page__title">
              ПРИВЕТ, {user.name.toUpperCase()}
            </h1>

            <p>
              Здесь ты можешь управлять своими
              бронированиями и смотреть историю посещений.
            </p>
          </div>

          <Link
            to="/booking"
            className="profile-page__book"
          >
            НОВАЯ БРОНЬ
            <span>+</span>
          </Link>
        </section>

        {/* ПРЕДСТОЯЩИЕ */}
        <section
          className="profile-section"
          id="upcoming"
        >
          <div className="profile-section__header">
            <div>
              <span className="profile-section__eyebrow">
                МОИ БРОНИРОВАНИЯ
              </span>

              <h2>
                ПРЕДСТОЯЩИЕ
              </h2>
            </div>
          </div>

          <div className="profile-bookings">
            {upcomingBookings.map((booking) => (
              <article
                key={booking.id}
                className="booking-card"
              >
                <div className="booking-card__main">
                  <div className="booking-card__number">
                    01
                  </div>

                  <div className="booking-card__info">
                    <span className="booking-card__zone">
                      {booking.zone}
                    </span>

                    <h3>
                      {booking.resource}
                    </h3>

                    <p>
                      {booking.date}
                      <span>•</span>
                      {booking.time}
                      <span>•</span>
                      {booking.duration} ч.
                    </p>
                  </div>
                </div>

                <div className="booking-card__side">
                  <span className="booking-card__status">
                    {booking.status}
                  </span>

                  <strong>
                    {booking.price} ₽
                  </strong>

                  <button
                    type="button"
                    className="booking-card__cancel"
                    onClick={() =>
                      handleCancel(booking.id)
                    }
                  >
                    ОТМЕНИТЬ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ИСТОРИЯ */}
        <section
          className="profile-section"
          id="history"
        >
          <div className="profile-section__header">
            <div>
              <span className="profile-section__eyebrow">
                АРХИВ
              </span>

              <h2>
                ИСТОРИЯ БРОНИРОВАНИЙ
              </h2>
            </div>
          </div>

          <div className="profile-history">
            {historyBookings.map((booking) => (
              <article
                key={booking.id}
                className="history-card"
              >
                <div className="history-card__date">
                  {booking.date}
                </div>

                <div className="history-card__zone">
                  <strong>
                    {booking.zone}
                  </strong>

                  <span>
                    {booking.resource}
                  </span>
                </div>

                <div className="history-card__time">
                  {booking.time}
                </div>

                <div className="history-card__duration">
                  {booking.duration} ч.
                </div>

                <div className="history-card__status">
                  {booking.status}
                </div>

                <strong className="history-card__price">
                  {booking.price} ₽
                </strong>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

export default Profile;