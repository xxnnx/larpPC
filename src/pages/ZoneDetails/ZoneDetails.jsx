import { Link, useParams } from 'react-router-dom';
import {
  LuArrowLeft,
  LuCheck,
  LuClock3,
  LuMonitor,
  LuMouse,
  LuCpu,
  LuMemoryStick,
  LuGamepad2,
  LuKeyboard,
} from 'react-icons/lu';

import zones from '../../data/zones';
import './ZoneDetails.css';

function ZoneDetails() {
  const { zoneId } = useParams();

  const zone = zones.find(
    (item) => item.id === zoneId
  );

  if (!zone) {
    return (
      <main className="zone-details zone-details--not-found">
        <div className="zone-details__not-found">
          <span>404</span>

          <h1>ЗОНА НЕ НАЙДЕНА</h1>

          <p>
            Такой игровой зоны пока не существует.
          </p>

          <Link
            to="/"
            className="zone-details__back-button"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="zone-details">

      {/* HERO */}

      <section className="zone-details__hero">

        <img
          src={zone.image}
          alt={zone.name}
          className="zone-details__hero-image"
        />

        <div className="zone-details__hero-overlay" />

        <div className="zone-details__hero-content">

          <Link
            to="/"
            className="zone-details__back"
          >
            <LuArrowLeft />
            <span>Назад к зонам</span>
          </Link>

          <span className="zone-details__eyebrow">
            {zone.label}
          </span>

          <h1 className="zone-details__title">
            {zone.name}
          </h1>

          <p className="zone-details__description">
            {zone.description}
          </p>

          <div className="zone-details__hero-bottom">

            <div className="zone-details__price">
              <span>ОТ</span>

              <strong>
                {zone.price} ₽
              </strong>

              <span>
                / ЧАС
              </span>
            </div>

            <Link
              to={`/booking?zone=${zone.id}`}
              className="zone-details__booking"
            >
              Забронировать
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>

      {/* EQUIPMENT */}

      <section className="zone-details__content">

        <div className="zone-details__section-header">

          <span className="zone-details__section-label">
            ОБОРУДОВАНИЕ
          </span>

          <h2>
            ЧТО ТЕБЯ
            <br />
            <span>ЖДЁТ</span>
          </h2>

        </div>

        <div className="zone-details__equipment">

          {Object.entries(zone.equipment).map(
            ([key, value]) => {

              const icons = {
                processor: <LuCpu />,
                graphics: <LuMonitor />,
                ram: <LuMemoryStick />,
                monitor: <LuMonitor />,
                keyboard: <LuKeyboard />,
                mouse: <LuMouse />,
                headset: <LuGamepad2 />,
                console: <LuGamepad2 />,
                display: <LuMonitor />,
                controller: <LuGamepad2 />,
                sound: <LuGamepad2 />,
              };

              const labels = {
                processor: 'ПРОЦЕССОР',
                graphics: 'ВИДЕОКАРТА',
                ram: 'ОПЕРАТИВНАЯ ПАМЯТЬ',
                monitor: 'МОНИТОР',
                keyboard: 'КЛАВИАТУРА',
                mouse: 'МЫШЬ',
                headset: 'ГАРНИТУРА',
                console: 'КОНСОЛЬ',
                display: 'ЭКРАН',
                controller: 'КОНТРОЛЛЕРЫ',
                sound: 'ЗВУК',
              };

              return (
                <div
                  className="zone-details__equipment-card"
                  key={key}
                >
                  <div className="zone-details__equipment-icon">
                    {icons[key] || <LuCheck />}
                  </div>

                  <div>
                    <span>
                      {labels[key] || key}
                    </span>

                    <strong>
                      {value}
                    </strong>
                  </div>
                </div>
              );
            }
          )}

        </div>

      </section>

      {/* FEATURES */}

      <section className="zone-details__features">

        <div className="zone-details__section-header">

          <span className="zone-details__section-label">
            В ЗОНЕ ЕСТЬ
          </span>

          <h2>
            ВСЁ ДЛЯ
            <br />
            <span>КОМФОРТНОЙ ИГРЫ</span>
          </h2>

        </div>

        <div className="zone-details__features-list">

          {zone.features.map((feature) => (
            <div
              className="zone-details__feature"
              key={feature}
            >
              <LuCheck />
              <span>
                {feature}
              </span>
            </div>
          ))}

        </div>

      </section>

      {/* TARIFFS */}

      <section className="zone-details__tariffs">

        <div className="zone-details__section-header">

          <span className="zone-details__section-label">
            ЦЕНЫ
          </span>

          <h2>
            ВЫБЕРИ
            <br />
            <span>СВОЙ ТАРИФ</span>
          </h2>

        </div>

        <div className="zone-details__tariffs-grid">

          {zone.tariffs.map((tariff) => (
            <Link
              to={`/booking?zone=${zone.id}&duration=${tariff.hours}`}
              className="zone-details__tariff"
              key={tariff.duration}
            >
              <LuClock3 />

              <span className="zone-details__tariff-duration">
                {tariff.duration}
              </span>

              <strong className="zone-details__tariff-price">
                {tariff.price}
              </strong>

              <span className="zone-details__tariff-label">
                ЗА ИГРОВОЕ МЕСТО
              </span>

              <span className="zone-details__tariff-action">
                Выбрать →
              </span>
            </Link>
          ))}

        </div>

        <Link
          to={`/booking?zone=${zone.id}`}
          className="zone-details__main-button"
        >
          Забронировать игровое место
          <span>→</span>
        </Link>

      </section>

    </main>
  );
}

export default ZoneDetails;