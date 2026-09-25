import ZoneCard from './ZoneCard';
import './ZonesSection.css';

import zones from '../../data/zones';

function ZonesSection() {
  return (
    <section className="zones" id="zones">
      <div className="zones__container">

        <div className="zones__header">
          <span className="zones__eyebrow">
            НАШИ ЗОНЫ
          </span>

          <h2 className="zones__title">
            РАЗНЫЕ ЗОНЫ
            <br />
            <span>С РАЗНЫМИ УСЛОВИЯМИ</span>
          </h2>

          <p className="zones__description">
            Выбери игровое место, которое подходит именно тебе.
          </p>
        </div>

        <div className="zones__grid">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              {...zone}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default ZonesSection;