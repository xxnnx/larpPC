import { api, getList } from '@/shared/api';

export const getTariffs = (roomId, signal) => getList(roomId ? `/tariffs/room/${encodeURIComponent(roomId)}` : '/tariffs', signal);
export const createTariff = details => api.post('/tariffs', details);
export const updateTariff = (id, { name, price }) => api.patch(`/tariffs/${encodeURIComponent(id)}`, { name, price });
export const setTariffActive = (id, active) => api.patch(`/tariffs/${encodeURIComponent(id)}/${active ? 'activate' : 'deactivate'}`);
