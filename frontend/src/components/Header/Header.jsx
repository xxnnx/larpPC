import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSkull } from 'react-icons/fa';
import { LuMenu, LuX, LuArrowUpRight } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    { label: 'Зоны', href: '#zones' },
    { label: 'Цены', href: '#prices' },
    { label: 'Атмосфера', href: '#gallery' },
    { label: 'Игры', href: '#games' },
    { label: 'Контакты', href: '#contacts' },
  ];
  return (
    <header className="header" onKeyDown={(event) => {
      if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus(); }
    }}>
      <a className="header__brand" href="#home" aria-label="GAMESENSE — главная"><FaSkull aria-hidden="true" /><span>GAMESENSE</span></a>
      <nav id="main-navigation" aria-label="Основная навигация" className={`header__navigation ${menuOpen ? 'header__navigation--open' : ''}`}>
        {navigation.map((item) => <a key={item.label} href={item.href} className="header__link" onClick={() => setMenuOpen(false)}>{item.label}</a>)}
      </nav>
      <div className="header__account">
        {user?.role === 'ADMIN' && <Link to="/admin" className="header__login">Админ-панель</Link>}
        {isAuthenticated ? <><Link to="/profile" className="header__user"><span className="header__user-avatar">{user?.name?.charAt(0).toUpperCase()}</span><span className="header__user-name">{user?.name}</span></Link><button type="button" className="header__logout" onClick={logout}>Выйти</button></> : <Link to="/login" className="header__login">Войти <LuArrowUpRight aria-hidden="true" /></Link>}
        <button id="menu-toggle" type="button" className="header__menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <LuX /> : <LuMenu />}</button>
      </div>
    </header>
  );
}
export default Header;
