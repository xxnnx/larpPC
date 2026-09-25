import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name: 'Иван',
      email,
      role: 'client',
    };

    login(user);

    navigate('/profile');
  };

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <Link to="/" className="auth-page__back">
          <span>←</span>
          На главную
        </Link>

        <div className="auth-page__content">
          <div className="auth-page__header">
            <span className="auth-page__eyebrow">
              КИБЕРТЕКА
            </span>

            <h1>ВХОД</h1>

            <p>
              Войди в аккаунт, чтобы управлять
              своими бронированиями.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-form__field">
              <label htmlFor="email">
                EMAIL
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="password">
                ПАРОЛЬ
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Введите пароль"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
            >
              ВОЙТИ
              <span>→</span>
            </button>
          </form>

          <div className="auth-page__footer">
            <span>
              Ещё нет аккаунта?
            </span>

            <Link to="/register">
              ЗАРЕГИСТРИРОВАТЬСЯ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;