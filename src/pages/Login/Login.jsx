import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import './Login.css';
import { getAuthError } from '../../api/authApi';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const destination = location.state?.from;
      navigate(typeof destination === 'string' && destination.startsWith('/') && !destination.startsWith('//') ? destination : '/profile', { replace: true });
    } catch (err) {
      setError(getAuthError(err, 'Не удалось войти. Попробуй ещё раз.'));
    } finally {
      setSubmitting(false);
    }
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
              GAMESENSE
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
            aria-busy={submitting}
          >
            {location.state?.registered && <p className="auth-feedback" role="status">Аккаунт создан. Войди с новым паролем.</p>}
            {error && <p className="auth-feedback auth-feedback--error" role="alert">{error}</p>}
            <div className="auth-form__field">
              <label htmlFor="email">
                EMAIL
              </label>

              <input
                id="email"
                autoComplete="username"
                disabled={submitting}
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
                autoComplete="current-password"
                disabled={submitting}
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
              disabled={submitting}
            >
              {submitting ? 'ВХОД…' : 'ВОЙТИ'}
              <span>→</span>
            </button>
          </form>

          <div className="auth-page__footer">
            <span>
              Ещё нет аккаунта?
            </span>

            <Link to="/register" state={{ from: location.state?.from }}>
              ЗАРЕГИСТРИРОВАТЬСЯ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
