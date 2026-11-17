
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
};


export const createCancellationRequest = (bookingId, reason) =>
  api.post(
    `/bookings/${encodeURIComponent(bookingId)}/cancellation-request`,
    { reason }
  );


export const getMyCancellationRequests = signal =>
  getList('/bookings/cancellation-requests/my', signal);


export const getAllCancellationRequests = signal =>
  getList('/bookings/cancellation-requests', signal);


export const approveCancellationRequest = (requestId, adminComment = '') =>
  api.patch(
    `/bookings/cancellation-requests/${encodeURIComponent(requestId)}/approve`,
    { adminComment }
  );

export const rejectCancellationRequest = (requestId, adminComment = '') =>
  api.patch(
    `/bookings/cancellation-requests/${encodeURIComponent(requestId)}/reject`,
    { adminComment }
  );
