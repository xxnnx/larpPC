
import { useState } from 'react';
import { getAllBookings, adminCancelBooking } from '@/entities/booking';
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

  
  const [cancelId, setCancelId] = useState(null);

  
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
    setCancelId(null);
  }

  
  function changePage(value) {
    setPage(Math.max(1, Math.min(value, totalPages)));
    setCancelId(null);
  }

  
  async function cancel(id) {
    if (
      await mutation.run(
        () => adminCancelBooking(id),
        `Бронь #${id} отменена.`
      )
    ) {
      setCancelId(null);
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
    cancelId,
    setCancelId,
    cancel,
    page: currentPage,
    totalPages,
    setPage: changePage,
    pageSize
  };
}
