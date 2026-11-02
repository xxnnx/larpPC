import { bookingStatuses } from '@/entities/booking';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { ManagementSection } from '@/shared/ui/ManagementSection';
import styles from '@/shared/ui/ManagementSection/layout.module.css';
import { displayDateTime, money } from '@/shared/utils';
import { useBookingsAdmin } from '../model/useBookingsAdmin';

export default function BookingsAdmin({ active, mutation }) {
  const model = useBookingsAdmin(active, mutation);
  const busy = mutation.busy || model.loading;
  return <ManagementSection title="Все бронирования" loading={model.loading} error={model.error} busy={mutation.busy} onRefresh={model.refresh}>
    <Field as="select" className={styles.filter} label="Статус" value={model.filter} onChange={event => model.setFilter(event.target.value)}>
      <option value="">Все</option>
      {Object.entries(bookingStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
    </Field>
    <div className={styles.list}>{model.bookings.map(entry => {
      const place = model.places.get(entry.computerId);
      return <article key={entry.id} className={styles.row}>
        <div>
          <h3>Бронь #{entry.id} · {place?.name || `Компьютер #${entry.computerId}`}</h3>
          <p>{place?.roomName} · {entry.tariffName}</p>
          <p>{displayDateTime(entry.startTime)} — {displayDateTime(entry.endTime)}</p>
        </div>
        <div>
          <strong>{money(entry.priceAtBooking)}</strong>
          <p>{bookingStatuses[entry.status] || entry.status}</p>
          {entry.status === 'ACTIVE' && (model.cancelId === entry.id
            ? <div className={styles.actions}>
              <span>Отменить бронь #{entry.id}? Деньги автоматически не возвращаются.</span>
              <Button disabled={busy} onClick={() => model.cancel(entry.id)}>Да, отменить</Button>
              <Button disabled={busy} onClick={() => model.setCancelId(null)}>Назад</Button>
            </div>
            : <Button disabled={busy} onClick={() => model.setCancelId(entry.id)}>Отменить бронь</Button>)}
        </div>
      </article>;
    })}</div>
    {!model.error && !model.bookings.length && <p>Бронирований с таким статусом пока нет.</p>}
  </ManagementSection>;
}
