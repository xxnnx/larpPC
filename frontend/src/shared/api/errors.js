export function getAuthError(error, fallback) {
  if (!error.response) {
    return error.request
      ? 'Не удалось связаться с сервером. Проверь подключение и попробуй ещё раз.'
      : error.message || fallback;
  }
  if ([401, 403].includes(error.response.status)) return 'Неверный email или пароль.';
  if (error.response.status >= 500) return 'Сервер временно недоступен. Попробуй позже.';
  const message = error.response.data?.error;
  return typeof message === 'string' ? message : fallback;
}

export function apiError(error, fallback = 'Не удалось загрузить данные.') {
  if (!error.response) return error.request ? 'Нет ответа от сервера. Попробуй позже.' : error.message || fallback;
  if (error.response.status === 401) return 'Сессия закончилась. Войди снова.';
  if (error.response.status === 403) return 'Сервер отклонил запрос. Попробуй войти снова.';
  return typeof error.response.data?.error === 'string' ? error.response.data.error : fallback;
}
