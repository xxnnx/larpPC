
import { useState } from 'react';
import {
  approveCancellationRequest,
  getAllBookings,
  getAllCancellationRequests,
  rejectCancellationRequest
} from '@/entities/booking';
import { getRooms } from '@/entities/room';
import { getComputersInRooms } from '@/entities/computer';
import { useRemoteData } from '@/shared/hooks';

async function loadBookings(signal) {
  const [rooms, bookings, requests] = await Promise.all([
    getRooms(signal),
    getAllBookings(signal),
    getAllCancellationRequests(signal)
  ]);

  const computers = await getComputersInRooms(rooms, signal);

  return { bookings, computers, requests };
}

export function useBookingsAdmin(active, mutation) {
  const remote = useRemoteData(
    loadBookings,
    { bookings: [], computers: [], requests: [] },
    active
  );

  
  const [filter, setFilter] = useState('ACTIVE');

  
  const [reviewId, setReviewId] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  
  const [page, setPage] = useState(1);
  const pageSize = 5;

  
  const bookings = remote.data.bookings.filter(
    entry => !filter || entry.status === filter
  );

  
  const places = new Map(
    remote.data.computers.map(computer => [computer.id, computer])
  );

  const pendingRequests = new Map(
    remote.data.requests
      .filter(request => request.status === 'PENDING')
      .map(request => [request.bookingId, request])
  );

  
  const totalPages = Math.max(
    1,
    Math.ceil(bookings.length / pageSize)
  );

  
  const currentPage = Math.min(page, totalPages);


  const paginatedBookings = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  
  function changeFilter(value) {
    setFilter(value);
    setPage(1);
    setReviewId(null);
    setAdminComment('');
  }

  
  function changePage(value) {
    setPage(Math.max(1, Math.min(value, totalPages)));
    setReviewId(null);
    setAdminComment('');
  }

  function startReview(requestId) {
    setReviewId(requestId);
    setAdminComment('');
    mutation.clear();
  }

  function cancelReview() {
    setReviewId(null);
    setAdminComment('');
  }

  async function review(request, approved) {
    const action = approved
      ? () => approveCancellationRequest(request.id, adminComment.trim())
      : () => rejectCancellationRequest(request.id, adminComment.trim());

    const message = approved
      ? `Бронь #${request.bookingId} отменена. Деньги возвращены игроку.`
      : `Запрос на отмену брони #${request.bookingId} отклонён.`;

    if (await mutation.run(action, message)) {
      cancelReview();
      remote.refresh();
    }
  }

  return {
    ...remote,
    bookings,
    paginatedBookings,
    places,
    pendingRequests,
    filter,
    setFilter: changeFilter,
    reviewId,
    adminComment,
    setAdminComment,
    startReview,
    cancelReview,
    review,
    page: currentPage,
    totalPages,
    setPage: changePage,
    pageSize
  };
}
