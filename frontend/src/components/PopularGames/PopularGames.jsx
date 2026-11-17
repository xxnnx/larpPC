import GameCard from './GameCard';
import './PopularGames.css';

import { getGames } from '@/entities/game';
import { useRemoteData } from '@/shared/hooks';

import gameCs2 from '../../assets/game-cs2.jpg';
import gameDota2 from '../../assets/game-dota2.jpg';
import gameGta5 from '../../assets/game-gta5.jpg';
import gameValorant from '../../assets/game-valorant.jpg';
import gameFortnite from '../../assets/game-fortnite.jpg';

const localImages = {
  'game-cs2': gameCs2,
  'game-cs2.jpg': gameCs2,
  'game-dota2': gameDota2,
  'game-dota2.jpg': gameDota2,
  'game-gta5': gameGta5,
  'game-gta5.jpg': gameGta5,
  'game-valorant': gameValorant,
  'game-valorant.jpg': gameValorant,
  'game-fortnite': gameFortnite,
  'game-fortnite.jpg': gameFortnite,
};

const localDetails = {
  'COUNTER-STRIKE 2': { image: gameCs2, genre: 'ТАКТИЧЕСКИЙ ШУТЕР', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+'] },
  'CS2': { image: gameCs2, genre: 'ТАКТИЧЕСКИЙ ШУТЕР', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+'] },
  'DOTA 2': { image: gameDota2, genre: 'MOBA', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+'] },
  'GTA V': { image: gameGta5, genre: 'ЭКШЕН', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+', 'PS5'] },
  'GTA 5': { image: gameGta5, genre: 'ЭКШЕН', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+', 'PS5'] },
  'VALORANT': { image: gameValorant, genre: 'ТАКТИЧЕСКИЙ ШУТЕР', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+'] },
  'FORTNITE': { image: gameFortnite, genre: 'BATTLE ROYALE', platform: 'PC', zones: ['СТАНДАРТ', 'СТАНДАРТ+', 'PS5'] },
};

function getLocalImage(imageUrl) {
  const fileName = imageUrl?.split(/[\\/]/).pop()?.split('?')[0].toLowerCase();
  return fileName ? localImages[fileName] : undefined;
}

function prepareGame(game, index) {
  const details = localDetails[game.name?.trim().toUpperCase()] || {};
  return {
    ...game,
    number: String(index + 1).padStart(2, '0'),
    genre: details.genre || 'ПОПУЛЯРНАЯ ИГРА',
    platform: details.platform || 'PC',
    zones: details.zones || ['СТАНДАРТ', 'СТАНДАРТ+'],
    image: getLocalImage(game.imageUrl) || details.image,
  };
}

function PopularGames() {
  const { data, loading, error, refresh } = useRemoteData(getGames, []);
  const games = data.map(prepareGame);

  return (
    <section className="popular-games" id="games">
      <div className="popular-games__container">

        <div className="popular-games__header">
          <span className="popular-games__eyebrow">
            ПОПУЛЯРНЫЕ ИГРЫ
          </span>

          <h2 className="popular-games__title">
            ВО ЧТО ИГРАЮТ
            <br />
            <span>У НАС</span>
          </h2>

          <p className="popular-games__description">
            Собрали игры, которые особенно хорошо
            заходят в нашей игровой зоне.
          </p>
        </div>

        {loading && <p className="popular-games__status" role="status">Загружаем игры…</p>}

        {!loading && error && (
          <div className="popular-games__status" role="alert">
            <span>{error}</span>
            <button type="button" onClick={refresh}>Попробовать снова</button>
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <p className="popular-games__status">Список игр пока пуст.</p>
        )}

        {!loading && !error && games.length > 0 && <div className="popular-games__grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              {...game}
            />
          ))}
        </div>}

        <div className="popular-games__footer">
          <span>
            БОЛЬШЕ ИГР — БОЛЬШЕ ВОЗМОЖНОСТЕЙ
          </span>

          <a
            href="#booking"
            className="popular-games__booking-link"
          >
            Забронировать место
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default PopularGames;
