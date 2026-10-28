import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import './Register.css';
import { getAuthError } from '../../api/authApi';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');

    if (!name.trim()) {
      setError('Введи имя.');
      return;
    }

    if (password !== passwordRepeat) {
      setError('Пароли не совпадают');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/login', { replace: true, state: { registered: true, email: email.trim(), from: location.state?.from } });
    } catch (err) {
      setError(getAuthError(err, 'Не удалось создать аккаунт. Попробуй ещё раз.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-page__container">
        <Link
          to="/"
          className="register-page__back"
        >
          <span>←</span>
          На главную
        </Link>

        <div className="register-page__content">
          <div className="register-page__header">
            <span className="register-page__eyebrow">
              GAMESENSE
            </span>

            <h1>РЕГИСТРАЦИЯ</h1>

            <p>
              Создай аккаунт и управляй
              своими бронированиями.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
            aria-busy={submitting}
          >
            {error && <p className="auth-feedback auth-feedback--error" role="alert">{error}</p>}
            <div className="register-form__field">
              <label htmlFor="name">
                ИМЯ
              </label>

              <input
                id="name"
                autoComplete="name"
                disabled={submitting}
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Твоё имя"
                required
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="register-email">
                EMAIL
              </label>

              <input
                id="register-email"
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

            <div className="register-form__field">
              <label htmlFor="register-password">
                ПАРОЛЬ
              </label>

              <input
                id="register-password"
                autoComplete="new-password"
                disabled={submitting}
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Минимум 6 символов"
                minLength={6}
                required
              />
            </div>

            <div className="register-form__field">
              <label htmlFor="password-repeat">
                ПОВТОРИТЕ ПАРОЛЬ
              </label>

              <input
                id="password-repeat"
                autoComplete="new-password"
                disabled={submitting}
                type="password"
                value={passwordRepeat}
                onChange={(event) =>
                  setPasswordRepeat(event.target.value)
                }
                placeholder="Повторите пароль"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="register-form__submit"
              disabled={submitting}
            >
              {submitting ? 'СОЗДАЁМ АККАУНТ…' : 'СОЗДАТЬ АККАУНТ'}
              <span>→</span>
            </button>
          </form>

          <div className="register-page__footer">
            <span>
              Уже есть аккаунт?
            </span>

            <Link to="/login" state={{ from: location.state?.from }}>
              ВОЙТИ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
