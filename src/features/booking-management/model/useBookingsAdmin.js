import { useState } from 'react';
import { getAllBookings, adminCancelBooking } from '@/entities/booking';
import { getRooms } from '@/entities/room';
import { getComputersInRooms } from '@/entities/computer';
import { useRemoteData } from '@/shared/hooks';

async function loadBookings(signal) {
  const [rooms, bookings] = await Promise.all([getRooms(signal), getAllBookings(signal)]);
  const computers = await getComputersInRooms(rooms, signal);
  return { bookings, computers };
}

export function useBookingsAdmin(active, mutation) {
  const remote = useRemoteData(loadBookings, { bookings: [], computers: [] }, active);
  const [filter, setFilter] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const bookings = remote.data.bookings.filter(entry => !filter || entry.status === filter);
  const places = new Map(remote.data.computers.map(computer => [computer.id, computer]));

  async function cancel(id) {
    if (await mutation.run(() => adminCancelBooking(id), `Бронь #${id} отменена.`)) {
      setCancelId(null);
      remote.refresh();
    }
  }

  return { ...remote, bookings, places, filter, setFilter, cancelId, setCancelId, cancel };
}
