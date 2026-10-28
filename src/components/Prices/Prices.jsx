import LiveTariffs from './LiveTariffs';
import './Prices.css';

export default function Prices() {
  return <section className="prices" id="prices"><div className="prices__container">
    <div className="section-heading"><div><span className="section-kicker">Тарифы</span><h2>Твой вечер. Твой формат.</h2></div><p>Час на разминку или целый игровой марафон — выбирай подходящий тариф.</p></div>
    <LiveTariffs />
  </div></section>;
}
