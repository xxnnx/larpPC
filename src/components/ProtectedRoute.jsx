import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { user, isAuthenticated, authLoading, authError, retryAuth, logout } = useAuth();

  if (authLoading) return <main><p role="status">Проверяем вход…</p></main>;
  if (authError) return <main><p role="alert">{authError}</p>
    <button type="button" onClick={retryAuth}>Повторить</button>
    <button type="button" onClick={logout}>Перейти ко входу</button>
  </main>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (requiredRole && user?.role !== requiredRole) return <main><h1>Доступ ограничен</h1><p>Этот раздел доступен только администратору.</p><Link to="/">На главную</Link></main>;
  return children;
}

export default ProtectedRoute;
