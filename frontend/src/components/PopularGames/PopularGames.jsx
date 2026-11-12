import GameCard from './GameCard';
import './PopularGames.css';

import gameCs2 from '../../assets/game-cs2.jpg';
import gameDota2 from '../../assets/game-dota2.jpg';
import gameGta5 from '../../assets/game-gta5.jpg';
import gameValorant from '../../assets/game-valorant.jpg';
import gameFortnite from '../../assets/game-fortnite.jpg';

function PopularGames() {
  const games = [
    {
      id: 1,
      number: '01',
      name: 'COUNTER-STRIKE 2',
      genre: 'ТАКТИЧЕСКИЙ ШУТЕР',
      platform: 'PC',
      zones: ['СТАНДАРТ', 'СТАНДАРТ+'],
      image: gameCs2,
    },
    {
      id: 2,
      number: '02',
      name: 'DOTA 2',
      genre: 'MOBA',
      platform: 'PC',
      zones: ['СТАНДАРТ', 'СТАНДАРТ+'],
      image: gameDota2,
    },
    {
      id: 3,
      number: '03',
      name: 'GTA V',
      genre: 'ЭКШЕН',
      platform: 'PC',
      zones: ['СТАНДАРТ', 'СТАНДАРТ+', 'PS5'],
      image: gameGta5,
    },
    {
      id: 4,
      number: '04',
      name: 'VALORANT',
      genre: 'ТАКТИЧЕСКИЙ ШУТЕР',
      platform: 'PC',
      zones: ['СТАНДАРТ', 'СТАНДАРТ+'],
      image: gameValorant,
    },
    {
      id: 5,
      number: '05',
      name: 'FORTNITE',
      genre: 'BATTLE ROYALE',
      platform: 'PC',
      zones: ['СТАНДАРТ', 'СТАНДАРТ+', 'PS5'],
      image: gameFortnite,
    },
  ];

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

        <div className="popular-games__grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              {...game}
            />
          ))}
        </div>

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