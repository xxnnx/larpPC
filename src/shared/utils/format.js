export const money = value => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(value));

export function displayDuration(value) {
  const minutes = Number(value);
  if (!Number.isInteger(minutes) || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return [hours && `${hours} ч`, remainder && `${remainder} мин`].filter(Boolean).join(' ');
}




export function clubDateTime(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(part => [part.type, part.value]));
  return parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hour + ':' + parts.minute;
}




// Backend uses LocalDateTime. Interpret it as the club's time, never browser UTC.
export function bookingDate(value) {
  return new Date(value && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : value + '+03:00');
}
export function endDateTime(start, minutes) {
  return clubDateTime(new Date(bookingDate(start).getTime() + minutes * 60000)) + ':00';
}
export function displayDateTime(value) {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', dateStyle: 'short', timeStyle: 'short' }).format(bookingDate(value));
}
