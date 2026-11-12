import { useEffect, useMemo, useReducer, useState } from 'react';
import { apiError } from '@/shared/api';

// Keep the loader stable (module function or useCallback). Only the current
// request may publish a result, including after refresh or switching tabs.
export function useRemoteData(loader, initialData, enabled = true) {
  const [revision, refresh] = useReducer(value => value + 1, 0);
  const request = useMemo(() => ({ loader, revision, enabled }), [loader, revision, enabled]);
  const [result, setResult] = useState({ request: null, data: initialData, error: '' });

  useEffect(() => {
    if (!request.enabled) return;
    const controller = new AbortController();
    Promise.resolve().then(() => request.loader(controller.signal))
      .then(data => {
        if (!controller.signal.aborted) setResult({ request, data, error: '' });
      })
      .catch(error => {
        if (!controller.signal.aborted) setResult(previous => ({ ...previous, request, error: apiError(error) }));
      });
    return () => controller.abort();
  }, [request]);

  const loading = enabled && result.request !== request;
  return { data: result.data, loading, error: loading ? '' : result.error, refresh };
}
