
import { useState } from 'react';
import {
  approveCancellation,
  getAllBookings,
  rejectCancellation
} from '@/entities/booking';
import { getRooms } from '@/entities/room';
import { getComputersInRooms } from '@/entities/computer';
import { useRemoteData } from '@/shared/hooks';

async function loadBookings(signal) {
  const [rooms, bookings] = await Promise.all([
    getRooms(signal),
    getAllBookings(signal)
  ]);

  const computers = await getComputersInRooms(rooms, signal);

  return { bookings, computers };
}

export function useBookingsAdmin(active, mutation) {
  const remote = useRemoteData(
    loadBookings,
    { bookings: [], computers: [] },
    active
  );

  
  const [filter, setFilter] = useState('ACTIVE');

  
  const [reviewId, setReviewId] = useState(null);

  
  const [page, setPage] = useState(1);
  const pageSize = 5;

  
  const bookings = remote.data.bookings.filter(
    entry => !filter || entry.status === filter
  );

  
  const places = new Map(
    remote.data.computers.map(computer => [computer.id, computer])
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
  }

  
  function changePage(value) {
    setPage(Math.max(1, Math.min(value, totalPages)));
    setReviewId(null);
  }

  function startReview(bookingId) {
    setReviewId(bookingId);
    mutation.clear();
  }

  function cancelReview() {
    setReviewId(null);
  }

  async function review(booking, approved) {
    const action = approved
      ? () => approveCancellation(booking.id)
      : () => rejectCancellation(booking.id);

    const message = approved
      ? `Бронь #${booking.id} отменена. Деньги возвращены игроку.`
      : `Запрос на отмену брони #${booking.id} отклонён.`;

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
    filter,
    setFilter: changeFilter,
    reviewId,
    startReview,
    cancelReview,
    review,
    page: currentPage,
    totalPages,
    setPage: changePage,
    pageSize
  };
}
