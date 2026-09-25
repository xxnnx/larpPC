import { LuMapPin, LuClock3, LuPhone } from 'react-icons/lu';
import { FaSkull } from "react-icons/fa";
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__logo">
          <div className="hero__logo-icon">
            <FaSkull />
          </div>

          <div className="hero__logo-text">
            <h1>GAMESENSE</h1>
            <span>КОМПЬЮТЕРНЫЙ КЛУБ</span>
          </div>
        </div>

        <div className="hero__info">

  <div className="hero__info-item">
    <LuMapPin />
    <span>г.Ростов-на-Дону ул.Мечникова 130</span>
  </div>

  <div className="hero__info-item">
    <LuClock3 />
    <span>Работаем круглосуточно</span>
  </div>

  <div className="hero__info-item">
    <LuPhone />
    <span>+7 908 510 17 73</span>
  </div>

</div>

        <a href="#booking" className="hero__button">
          Забронировать!
        </a>
      </div>
    </section>
  );
}

export default Hero;