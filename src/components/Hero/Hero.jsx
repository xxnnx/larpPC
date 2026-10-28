import { LuMapPin, LuClock3, LuPhone, LuArrowUpRight, LuArrowDown } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import './Hero.css';
import clubImage from '../../assets/standard.jpg';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__status"><span /> Ростов-на-Дону <span className="hero__status-divider">/</span> Открыты 24/7</div>
        <div className="hero__logo-text"><span>Компьютерный клуб</span><h1>GAMESENSE</h1></div>
        <p className="hero__headline">Твоё место<br />Твоя игра</p>
        <p className="hero__description">Заходи на пару матчей или собирай друзей на всю ночь. Выбирай свой PC или PlayStation — и погружайся в игру.</p>
        <div className="hero__actions"><Link to="/booking" className="hero__button">Забронировать место <LuArrowUpRight /></Link><a href="#zones" className="hero__secondary">Выбрать зону <LuArrowDown /></a></div>
        <div className="hero__info"><div className="hero__info-item"><LuMapPin /><span>ул. Мечникова, 130</span></div><a className="hero__info-item" href="tel:+79085101773"><LuPhone /><span>+7 908 510 17 73</span></a></div>
      </div>
      <figure className="hero__visual"><img src={clubImage} alt="Игровые места в зоне Стандарт" /><figcaption><span>Внутри GAMESENSE</span><a href="#gallery">Смотреть клуб ↗</a></figcaption></figure>
      <div className="hero__bottom"><span><LuClock3 /> Играй в своём ритме. Круглосуточно.</span><a href="#zones">Знакомься с клубом <LuArrowDown /></a></div>
    </section>
  );
}
export default Hero;


