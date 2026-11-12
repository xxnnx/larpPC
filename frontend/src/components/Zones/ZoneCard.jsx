import { Link } from 'react-router-dom';
import './ZoneCard.css';

function ZoneCard({
  id,
  name,
  label,
  description,
  image,
}) {
  return (
    <article className="zone-card">

      <div className="zone-card__image-wrapper">
        <img
          src={image}
          alt={name}
          className="zone-card__image"
        />

        <div className="zone-card__overlay" />
      </div>

      <div className="zone-card__content">

        <span className="zone-card__label">
          {label}
        </span>

        <h3 className="zone-card__title">
          {name}
        </h3>

        <p className="zone-card__description">
          {description}
        </p>

        <div className="zone-card__bottom">

          <span className="zone-card__price">
            Оборудование и тарифы
          </span>

          <Link
            to={`/zones/${id}`}
            className="zone-card__link"
          >
            Подробнее
            <span>→</span>
          </Link>

        </div>

      </div>
    </article>
  );
}

export default ZoneCard;
