/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { api, AUTH_EXPIRED_EVENT } from '../api/api';
import { getAuthError } from '../api/authApi';

export const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }


function tokenExpiresAt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
    return typeof exp === 'number' ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthError('');
  };

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, []);

  useEffect(() => {
    if (!user) return;
    const remaining = tokenExpiresAt(localStorage.getItem('token') || '') - Date.now();
    const timer = window.setTimeout(logout, Math.max(0, remaining));
    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('token');
    localStorage.removeItem('user');
    if (!token || tokenExpiresAt(token) <= Date.now()) {
      localStorage.removeItem('token');
      setAuthLoading(false);
      return () => controller.abort();
    }
    setAuthLoading(true);
    setAuthError('');
    api.get('/auth/me', { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted && localStorage.getItem('token') === token) setUser(data);
      })
      .catch((error) => {
        if (controller.signal.aborted || localStorage.getItem('token') !== token) return;
        if ([401, 403].includes(error.response?.status)) logout();
        else setAuthError(getAuthError(error, 'Не удалось проверить вход. Попробуй ещё раз.'));
      })
      .finally(() => { if (!controller.signal.aborted) setAuthLoading(false); });
    return () => controller.abort();
  }, [restoreAttempt]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials, { skipAuth: true });
    if (!data.token || !data.user) throw new Error('Сервер не вернул данные для входа.');
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setAuthError('');
  };

  const register = async (details) => {
    await api.post('/auth/register', details, { skipAuth: true });
  };

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), authLoading,
    authError, retryAuth: () => setRestoreAttempt(value => value + 1), login, register, logout }}>
    {children}
  </AuthContext.Provider>;
}
