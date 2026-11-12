import { api, getList } from '@/shared/api';

export const computerStatuses = { AVAILABLE: 'Доступен', MAINTENANCE: 'Обслуживание', DISABLED: 'Отключён' };
export const getComputersByRoom = (roomId, signal) => getList(`/rooms/${encodeURIComponent(roomId)}/computers`, signal);
export async function getComputersInRooms(rooms, signal) {
  const groups = await Promise.all(rooms.map(async room =>
    (await getComputersByRoom(room.id, signal)).map(computer => ({ ...computer, roomId: room.id, roomName: room.name }))
  ));
  return groups.flat();
}
export const saveComputer = (id, details) => id
  ? api.put(`/computers/${encodeURIComponent(id)}`, details)
  : api.post('/computers', details);



export const getAvailableComputers = async (
  roomId,
  tariffId,
  start,
  end,
  signal
) => {
  const formatDateTime = (value) =>
    value.length === 16 ? `${value}:00` : value;

  const response = await api.get('/computers/available', {
    params: {
      roomId,
      tariffId,
      startTime: formatDateTime(start),
      endTime: formatDateTime(end),
    },
    signal,
  });

  return response.data;
};