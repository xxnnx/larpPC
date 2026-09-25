const zones = [
  {
    id: 'standard',
    name: 'СТАНДАРТ',
    price: 150,
  },
  {
    id: 'standard-plus',
    name: 'СТАНДАРТ+',
    price: 200,
  },
  {
    id: 'console',
    name: 'ПРИСТАВКА',
    price: 250,
  },
];

const resources = [
  {
    id: 'pc-01',
    name: 'ПК-01',
    zoneId: 'standard',
    available: true,
    availableFrom: '10:00',
    availableTo: '22:00',
  },
  {
    id: 'pc-02',
    name: 'ПК-02',
    zoneId: 'standard',
    available: true,
    availableFrom: '10:00',
    availableTo: '20:00',
  },
  {
    id: 'pc-03',
    name: 'ПК-03',
    zoneId: 'standard',
    available: false,
    availableFrom: '10:00',
    availableTo: '22:00',
  },
  {
    id: 'pc-04',
    name: 'ПК-04',
    zoneId: 'standard',
    available: true,
    availableFrom: '12:00',
    availableTo: '23:00',
  },
  {
    id: 'pc-05',
    name: 'ПК-05',
    zoneId: 'standard',
    available: true,
    availableFrom: '10:00',
    availableTo: '22:00',
  },

  {
    id: 'pc-06',
    name: 'ПК-06',
    zoneId: 'standard-plus',
    available: true,
    availableFrom: '10:00',
    availableTo: '22:00',
  },
  {
    id: 'pc-07',
    name: 'ПК-07',
    zoneId: 'standard-plus',
    available: true,
    availableFrom: '11:00',
    availableTo: '23:00',
  },
  {
    id: 'pc-08',
    name: 'ПК-08',
    zoneId: 'standard-plus',
    available: false,
    availableFrom: '10:00',
    availableTo: '22:00',
  },

  {
    id: 'ps5-01',
    name: 'PS5-01',
    zoneId: 'console',
    available: true,
    availableFrom: '10:00',
    availableTo: '23:00',
  },
  {
    id: 'ps5-02',
    name: 'PS5-02',
    zoneId: 'console',
    available: true,
    availableFrom: '12:00',
    availableTo: '23:00',
  },
];

export function getZones() {
  return Promise.resolve(zones);
}

export function getResources(zoneId) {
  const filteredResources = resources.filter(
    (resource) => resource.zoneId === zoneId
  );

  return Promise.resolve(filteredResources);
}

export function getAvailability(resourceId, date) {
  const resource = resources.find(
    (item) => item.id === resourceId
  );

  if (!resource) {
    return Promise.resolve(null);
  }

  return Promise.resolve({
    resourceId: resource.id,
    date,
    availableFrom: resource.availableFrom,
    availableTo: resource.availableTo,
  });
}

export function createBooking(bookingData) {
  console.log('Создание бронирования:', bookingData);

  return Promise.resolve({
    success: true,
    booking: bookingData,
  });
}