import './Footer.css';

function Footer() {
  const navigation = [
    { label: 'Главная', href: '#home' },
    { label: 'Зоны', href: '#zones' },
    { label: 'Фото', href: '#gallery' },
    { label: 'Игры', href: '#games' },
    { label: 'Бронирование', href: '#booking' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__main">

          <div className="footer__brand">
            <a href="#home" className="footer__logo">
              GAMESENSE
            </a>

            <span className="footer__tagline">
              ПОЧУВСТВУЙ
            </span>
          </div>

          <div className="footer__contacts">
            <div className="footer__contact">
              <span className="footer__contact-label">
                АДРЕС
              </span>

              <span className="footer__contact-value">
                г.Ростов-на-Дону ул.Мечникова 130
              </span>
            </div>

            <div className="footer__contact">
              <span className="footer__contact-label">
                РЕЖИМ РАБОТЫ
              </span>

              <span className="footer__contact-value">
                Круглосуточно · 24/7
              </span>
            </div>

            <div className="footer__contact">
              <span className="footer__contact-label">
                ТЕЛЕФОН
              </span>

              <a
                href="tel:+79773208888"
                className="footer__contact-value footer__contact-link"
              >
                7 908 510 17 73
              </a>
            </div>
          </div>

          <nav className="footer__navigation">
            <span className="footer__navigation-title">
              НАВИГАЦИЯ
            </span>

            <div className="footer__navigation-list">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer__navigation-link"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">
            © 2026 КИБЕРТЕКА
          </span>

          <span className="footer__bottom-text">
            ИГРАЙ. ПОБЕЖДАЙ. ПОВТОРЯЙ.
          </span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;