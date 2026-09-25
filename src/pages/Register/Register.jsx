import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== passwordRepeat) {
      alert('Пароли не совпадают');
      return;
    }

    const user = {
      name,
      email,
      role: 'client',
    };

    register(user);

    navigate('/profile');
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
              КИБЕРТЕКА
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
          >
            <div className="register-form__field">
              <label htmlFor="name">
                ИМЯ
              </label>

              <input
                id="name"
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
            >
              СОЗДАТЬ АККАУНТ
              <span>→</span>
            </button>
          </form>

          <div className="register-page__footer">
            <span>
              Уже есть аккаунт?
            </span>

            <Link to="/login">
              ВОЙТИ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;