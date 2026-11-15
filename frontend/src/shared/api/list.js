import { api } from './http';

export async function getList(path, signal) {
  const { data } = await api.get(path, { signal });
  if (!Array.isArray(data)) throw new Error('Сервер вернул некорректный список.');
  return data;
}
