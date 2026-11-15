
import { bookingStatuses } from '@/entities/booking';
import { Button } from '@/shared/ui/Button';
import { ManagementSection } from '@/shared/ui/ManagementSection';
import styles from '@/shared/ui/ManagementSection/layout.module.css';
import { displayDateTime, money } from '@/shared/utils';
import { useBookingsAdmin } from '../model/useBookingsAdmin';

export default function BookingsAdmin({ active, mutation }) {
  const model = useBookingsAdmin(active, mutation);
  const busy = mutation.busy || model.loading;

  const filters = [
    { value: 'ACTIVE', label: 'Активна' },
    { value: 'CANCELLED', label: 'Отменена' },
    { value: 'COMPLETED', label: 'Завершена' },
  ];

  return (
    <ManagementSection
      title="Все бронирования"
      loading={model.loading}
      error={model.error}
      busy={mutation.busy}
      onRefresh={model.refresh}
    >
      {/* Фильтры по статусу */}
      <div className={styles.filters}>
        {filters.map(({ value, label }) => (
          <Button
            key={value}
            className={`${styles.filterButton} ${
              model.filter === value ? styles.selected : ''
            }`}
            aria-pressed={model.filter === value}
            disabled={busy}
            onClick={() => model.setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      
      <div className={styles.list}>
        {model.paginatedBookings.map(entry => {
          const place = model.places.get(entry.computerId);

          return (
            <article key={entry.id} className={styles.row}>
              <div>
                <h3>
                  Бронь #{entry.id} ·{' '}
                  {place?.name || `Компьютер #${entry.computerId}`}
                </h3>

                <p>
                  {place?.roomName} · {entry.tariffName}
                </p>

                <p>
                  {displayDateTime(entry.startTime)} —{' '}
                  {displayDateTime(entry.endTime)}
                </p>
              </div>

              {/* Цена, статус и отмена */}
              <div className={styles.bookingInfo}>
                <strong>{money(entry.priceAtBooking)}</strong>

                <p>
                  {bookingStatuses[entry.status] || entry.status}
                </p>

                {entry.status === 'ACTIVE' && (
                  model.cancelId === entry.id ? (
                    <div className={styles.actions}>
                      <span>
                        Отменить бронь #{entry.id}?
                        Деньги автоматически не возвращаются.
                      </span>

                      <Button
                        disabled={busy}
                        onClick={() => model.cancel(entry.id)}
                      >
                        Да, отменить
                      </Button>

                      <Button
                        disabled={busy}
                        onClick={() => model.setCancelId(null)}
                      >
                        Назад
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.actions}>
                      <Button
                        disabled={busy}
                        className={styles.cancelButton}
                        onClick={() => model.setCancelId(entry.id)}
                      >
                        Отменить бронь
                      </Button>
                    </div>
                  )
                )}
              </div>
            </article>
          );
        })}
      </div>

      
      {!model.error && !model.bookings.length && (
        <p>Бронирований с таким статусом пока нет.</p>
      )}

      
      {model.bookings.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Страница {model.page} из {model.totalPages}
          </span>

          <div className={styles.pageButtons}>
            <Button
              disabled={model.page === 1 || busy}
              onClick={() => model.setPage(model.page - 1)}
            >
              ←
            </Button>

            {Array.from(
              { length: model.totalPages },
              (_, index) => index + 1
            ).map(number => (
              <Button
                key={number}
                disabled={busy}
                className={
                  model.page === number ? styles.currentPage : ''
                }
                aria-current={
                  model.page === number ? 'page' : undefined
                }
                onClick={() => model.setPage(number)}
              >
                {number}
              </Button>
            ))}

            <Button
              disabled={model.page === model.totalPages || busy}
              onClick={() => model.setPage(model.page + 1)}
            >
              →
            </Button>
          </div>
        </div>
      )}
    </ManagementSection>
  );
}
