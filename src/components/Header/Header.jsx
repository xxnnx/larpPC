import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { label: 'Главная', href: '#home' },
    { label: 'Зоны', href: '#zones' },
    { label: 'Цены', href: '#prices' },
    { label: 'Фото', href: '#gallery' },
    { label: 'Игры', href: '#games' },
    { label: 'Контакты', href: '#contacts' },
  ];

  return (
    <header className="header">
      <nav className="header__navigation">
        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="header__link"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header__account">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="header__user"
            >
              <span className="header__user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </span>

              <span className="header__user-name">
                {user?.name}
              </span>
            </Link>

            <button
              type="button"
              className="header__logout"
              onClick={logout}
            >
              ВЫЙТИ
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="header__login"
          >
            ВОЙТИ
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;