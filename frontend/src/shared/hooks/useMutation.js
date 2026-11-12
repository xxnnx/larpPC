import { useEffect, useReducer, useRef } from 'react';
import { apiError } from '@/shared/api';

const initialState = { busy: false, error: '', notice: '' };
function reducer(state, action) {
  switch (action.type) {
    case 'start': return { busy: true, error: '', notice: '' };
    case 'success': return { busy: false, error: '', notice: action.message };
    case 'error': return { busy: false, error: action.message, notice: '' };
    case 'clear': return { ...state, error: '', notice: '' };
    default: return state;
  }
}

export function useMutation() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lock = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function run(action, message) {
    if (lock.current) return false;
    lock.current = true;
    dispatch({ type: 'start' });
    try {
      await action();
      if (!mounted.current) return false;
      dispatch({ type: 'success', message });
      return true;
    } catch (error) {
      if (mounted.current) dispatch({ type: 'error', message: error.response
        ? apiError(error, 'Не удалось сохранить изменения.')
        : 'Не удалось подтвердить результат. Обнови список перед повторной отправкой.' });
      return false;
    } finally { lock.current = false; }
  }

  return { ...state, run, clear: () => dispatch({ type: 'clear' }),
    setError: message => dispatch({ type: 'error', message }) };
}
