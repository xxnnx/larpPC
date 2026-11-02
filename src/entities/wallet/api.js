import { api, getList } from '@/shared/api';

export async function getBalance(signal) {
  const { data } = await api.get('/wallet', { signal });
  if (data?.balance == null || !Number.isFinite(Number(data.balance))) throw new Error('Сервер не вернул баланс.');
  return Number(data.balance);
}
export const getTransactions = signal => getList('/wallet/transactions', signal);
export const topUp = (userId, amount) => api.post('/wallet/top-up', { userId, amount });
