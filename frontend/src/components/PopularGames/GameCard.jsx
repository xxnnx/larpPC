import { Link } from 'react-router-dom';
import './GameCard.css';

function GameCard({
  number,
  name,
  genre,
  platform,
  zones,
  image,
}) {
  const getZoneUrl = (zone) => {
    if (zone === 'СТАНДАРТ') {
      return 'standard';
    }

    if (zone === 'СТАНДАРТ+') {
      return 'standard-plus';
    }

    if (zone === 'PS5') {
      return 'console';
    }

    return '';
  };

  const getGameUrl = () => {
    return encodeURIComponent(name);
  };

  return (
    <article className="game-card">
      <div className="game-card__image-wrapper">

        <img
          src={image}
          alt={name}
          className="game-card__image"
        />

        <div className="game-card__overlay" />

        <span className="game-card__number">
          {number}
        </span>

        <div className="game-card__content">

          <span className="game-card__genre">
            {genre}
          </span>

          <h3 className="game-card__title">
            {name}
          </h3>

          <div className="game-card__info">

            <span className="game-card__platform">
              {platform}
            </span>

            {zones.map((zone) => {
              const zoneUrl = getZoneUrl(zone);

              return (
                <Link
                  key={zone}
                  to={`/booking?zone=${zoneUrl}&game=${getGameUrl()}`}
                  className="game-card__zone"
                  onClick={(event) => event.stopPropagation()}
                >
                  {zone}
                </Link>
              );
            })}

          </div>

        </div>

      </div>
    </article>
  );
}

export default GameCard;