import { api } from './api';


const zones = [
  { id: 'standard', name: 'СТАНДАРТ', price: 150 },
  { id: 'standard-plus', name: 'СТАНДАРТ+', price: 200 },
  { id: 'console', name: 'ПРИСТАВКА', price: 250 },
];

export async function getZones() {
  return Promise.resolve(zones);
}

export async function getResources(zoneId) {
  try {
    
    const response = await api.get('/computers');
    
    
    const mappedResources = response.data.map((pc) => ({
      id: pc.id,
      name: pc.name,
      zoneId: 'standard',
      available: pc.status === 'AVAILABLE', 
      availableFrom: '10:00',
      availableTo: '22:00',
    }));

    
    return mappedResources.filter((resource) => resource.zoneId === zoneId);
    
  } catch (error) {
    console.error('Ошибка при загрузке ПК:', error);
    return [];
  }
}

export async function getAvailability(resourceId, date) {
  
  return Promise.resolve({
    resourceId: resourceId,
    date,
    availableFrom: '10:00',
    availableTo: '22:00',
  });
}

export async function createBooking(bookingData) {
  try {
    
    const response = await api.post('/bookings', bookingData);
    
    return {
      success: true,
      booking: response.data,
    };
  } catch (error) {
    console.error('Ошибка при создании бронирования:', error);
    
    
    
    // throw new Error('Не удалось забронировать место. Сервер пока не готов.');
  }
}