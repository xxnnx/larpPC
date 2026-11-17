import { getList } from '@/shared/api';

export function getGames(signal) {
  return getList('/games', signal);
}
