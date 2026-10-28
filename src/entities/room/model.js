import { getList } from '@/shared/api';

export const getRooms = signal => getList('/rooms', signal);

export function matchRoom(rooms, hint) {
  const names = { standard: 'Стандарт', 'standard-plus': 'Стандарт+', console: 'Приставка' };
  const normalize = value => String(value || '').toLowerCase().replace(/\s/g, '');
  return rooms.find(room => String(room.id) === String(hint))
    || rooms.find(room => normalize(room.name) === normalize(names[hint] || hint));
}
