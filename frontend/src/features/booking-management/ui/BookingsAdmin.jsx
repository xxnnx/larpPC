
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
          const cancellationRequest = model.pendingRequests.get(entry.id);

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

              <div className={styles.bookingInfo}>
                <strong>{money(entry.priceAtBooking)}</strong>

                <p>
                  {bookingStatuses[entry.status] || entry.status}
                </p>

                {cancellationRequest && (
                  <div className={styles.reviewPanel}>
                    <strong>Запрос на отмену</strong>
                    <p>
                      Причина: {cancellationRequest.reason || 'не указана'}
                    </p>

                    {model.reviewId === cancellationRequest.id ? (
                      <>
                        <textarea
                          value={model.adminComment}
                          onChange={event => model.setAdminComment(event.target.value)}
                          placeholder="Комментарий игроку (необязательно)"
                          maxLength={1000}
                          rows={3}
                          disabled={busy}
                        />
                        <div className={styles.actions}>
                          <Button
                            disabled={busy}
                            onClick={() => model.review(cancellationRequest, true)}
                          >
                            Подтвердить отмену
                          </Button>
                          <Button
                            className={styles.cancelButton}
                            disabled={busy}
                            onClick={() => model.review(cancellationRequest, false)}
                          >
                            Отклонить
                          </Button>
                          <Button disabled={busy} onClick={model.cancelReview}>
                            Назад
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        disabled={busy}
                        onClick={() => model.startReview(cancellationRequest.id)}
                      >
                        Рассмотреть запрос
                      </Button>
                    )}
                  </div>
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
