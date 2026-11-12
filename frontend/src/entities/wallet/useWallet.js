import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiError } from '@/shared/api';
import { getBalance } from './api';

export function useWallet() {
  const { user } = useAuth();
  const userId = user?.id;
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ balance: null, loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    if (userId != null) getBalance(controller.signal)
      .then(balance => { if (!controller.signal.aborted) setState({ balance, loading: false, error: '', userId, version }); })
      .catch(error => { if (!controller.signal.aborted) setState({ balance: null, loading: false, error: apiError(error), userId, version }); });
    return () => controller.abort();
  }, [userId, version]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') setVersion(value => value + 1); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const current = state.userId === userId && state.version === version;
  return { ...(current ? state : { balance: null, loading: true, error: '' }), refresh: () => setVersion(value => value + 1) };
}
