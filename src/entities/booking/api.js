import { api, getList } from '@/shared/api';

export const getMyBookings = signal => getList('/bookings/my', signal);
export const getAllBookings = signal => getList('/bookings', signal);

export async function createBooking(details) {
  const { data } = await api.post('/bookings', details);
  if (!data?.id) throw new Error('Не удалось подтвердить создание брони. Проверь личный кабинет перед повторной отправкой.');
  return data;
}

export const cancelBooking = id => api.delete(`/bookings/${encodeURIComponent(id)}`);
export const adminCancelBooking = id => api.patch(`/bookings/${encodeURIComponent(id)}/cancel`);
