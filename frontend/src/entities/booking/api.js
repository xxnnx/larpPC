
import { api, getList } from '@/shared/api';

export const getMyBookings = signal =>
  getList('/bookings/my', signal);

export const getAllBookings = signal =>
  getList('/bookings', signal);

export async function createBooking(details) {
  const { data } = await api.post('/bookings', details);

  if (!data?.id) {
    throw new Error(
      'Не удалось подтвердить создание брони. Проверь личный кабинет перед повторной отправкой.'
    );
  }

  return data;
}

export const requestCancellation = bookingId =>
  api.patch(
    `/bookings/${encodeURIComponent(bookingId)}/request-cancellation`
  );

export const getCancellationRequests = signal =>
  getList('/bookings/cancellation-requests', signal);

export const approveCancellation = bookingId =>
  api.patch(
    `/bookings/${encodeURIComponent(bookingId)}/approve-cancellation`
  );

export const rejectCancellation = bookingId =>
  api.patch(
    `/bookings/${encodeURIComponent(bookingId)}/reject-cancellation`
  );
