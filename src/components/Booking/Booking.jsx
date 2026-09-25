import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import {
  getZones,
  getResources,
  getAvailability,
  createBooking,
} from '../../api/bookingApi';

import 'react-datepicker/dist/react-datepicker.css';
import './Booking.css';

function Booking() {
  const [searchParams] = useSearchParams();

  const zoneFromUrl = searchParams.get('zone');
  const gameFromUrl = searchParams.get('game');

  // =========================================
  // DATA FROM BACKEND
  // =========================================

  const [zones, setZones] = useState([]);
  const [resources, setResources] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // =========================================
  // BOOKING STATE
  // =========================================

  const [zone, setZone] = useState(zoneFromUrl || '');
  const [date, setDate] = useState(null);
  const [resource, setResource] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);

  // =========================================
  // LOADING / ERRORS
  // =========================================

  const [zonesLoading, setZonesLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // =========================================
  // LOAD ZONES
  // =========================================

  useEffect(() => {
    async function loadZones() {
      try {
        setZonesLoading(true);
        setError('');

        const data = await getZones();

        const normalizedZones = Array.isArray(data)
          ? data
          : [];

        setZones(normalizedZones);

        // Проверяем зону из URL
        if (zoneFromUrl) {
          const zoneExists = normalizedZones.some(
            (item) => String(item.id) === String(zoneFromUrl)
          );

          if (!zoneExists) {
            setZone('');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить игровые зоны.');
      } finally {
        setZonesLoading(false);
      }
    }

    loadZones();
  }, [zoneFromUrl]);

  // =========================================
  // SELECTED ZONE
  // =========================================

  const selectedZone = useMemo(() => {
    return zones.find(
      (item) => String(item.id) === String(zone)
    );
  }, [zones, zone]);

  // =========================================
  // LOAD RESOURCES
  // =========================================

  useEffect(() => {
    async function loadResources() {
      if (!zone) {
        setResources([]);
        setResource('');
        setTime('');
        setAvailableTimes([]);
        return;
      }

      try {
        setResourcesLoading(true);
        setError('');

        const data = await getResources(zone);

        const normalizedResources = Array.isArray(data)
          ? data
          : [];

        setResources(normalizedResources);

        setResource('');
        setTime('');
        setAvailableTimes([]);
      } catch (err) {
        console.error(err);

        setResources([]);
        setResource('');
        setTime('');
        setAvailableTimes([]);

        setError(
          'Не удалось загрузить игровые места.'
        );
      } finally {
        setResourcesLoading(false);
      }
    }

    loadResources();
  }, [zone]);

  // =========================================
  // SELECTED RESOURCE
  // =========================================

  const selectedResource = useMemo(() => {
    return resources.find(
      (item) =>
        String(item.id) === String(resource)
    );
  }, [resources, resource]);

  // =========================================
  // LOAD AVAILABILITY
  // =========================================

  useEffect(() => {
    async function loadAvailability() {
      if (!resource || !date) {
        setAvailableTimes([]);
        return;
      }

      try {
        setAvailabilityLoading(true);
        setError('');

        const dateString = date
          .toISOString()
          .split('T')[0];

        const data = await getAvailability(
          resource,
          dateString
        );

        let times = [];

        /*
         * Backend может вернуть:
         *
         * ["10:00", "11:00", "12:00"]
         *
         * или:
         *
         * [
         *   { time: "10:00" },
         *   { time: "11:00" }
         * ]
         *
         * или:
         *
         * {
         *   availableFrom: "10:00",
         *   availableTo: "22:00"
         * }
         */

        if (Array.isArray(data)) {
          times = data
            .map((item) => {
              if (typeof item === 'string') {
                return item;
              }

              return item?.time || null;
            })
            .filter(Boolean);
        } else if (
          data &&
          data.availableFrom &&
          data.availableTo
        ) {
          const [fromHour] = data.availableFrom
            .split(':')
            .map(Number);

          const [toHour] = data.availableTo
            .split(':')
            .map(Number);

          for (
            let hour = fromHour;
            hour < toHour;
            hour += 1
          ) {
            times.push(
              `${String(hour).padStart(2, '0')}:00`
            );
          }
        }

        setAvailableTimes(times);
        setTime('');
        setDuration(1);
      } catch (err) {
        console.error(err);

        setAvailableTimes([]);
        setTime('');

        setError(
          'Не удалось получить свободное время.'
        );
      } finally {
        setAvailabilityLoading(false);
      }
    }

    loadAvailability();
  }, [resource, date]);

  // =========================================
  // MAX DURATION
  // =========================================

  const maxDuration = useMemo(() => {
    if (!selectedResource || !time) {
      return 1;
    }

    /*
     * Если backend передал availableTo,
     * используем его.
     */

    if (selectedResource.availableTo) {
      const startHour = Number(
        time.split(':')[0]
      );

      const endHour = Number(
        selectedResource.availableTo.split(':')[0]
      );

      return Math.max(
        endHour - startHour,
        1
      );
    }

    /*
     * Если backend вернул слоты,
     * считаем оставшиеся часы.
     */

    const timeIndex =
      availableTimes.indexOf(time);

    if (timeIndex === -1) {
      return 1;
    }

    return Math.max(
      availableTimes.length - timeIndex,
      1
    );
  }, [
    selectedResource,
    time,
    availableTimes,
  ]);

  // =========================================
  // ZONE
  // =========================================

  const handleZoneChange = (zoneId) => {
    setZone(zoneId);

    setResource('');
    setTime('');
    setDuration(1);

    setSuccess('');
    setError('');
  };

  // =========================================
  // DATE
  // =========================================

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    setResource('');
    setTime('');
    setDuration(1);

    setSuccess('');
    setError('');
  };

  // =========================================
  // RESOURCE
  // =========================================

  const handleResourceChange = (resourceId) => {
    setResource(resourceId);

    setTime('');
    setDuration(1);

    setSuccess('');
    setError('');
  };

  // =========================================
  // TIME
  // =========================================

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
    setDuration(1);

    setSuccess('');
    setError('');
  };

  // =========================================
  // DURATION
  // =========================================

  const handleDurationChange = (event) => {
    const value = Number(
      event.target.value
    );

    if (value < 1) {
      setDuration(1);
      return;
    }

    if (value > maxDuration) {
      setDuration(maxDuration);
      return;
    }

    setDuration(value);
  };

  // =========================================
  // PRICE
  // =========================================

  const pricePerHour = Number(
    selectedZone?.price || 0
  );

  const totalPrice =
    pricePerHour * Number(duration);

  // =========================================
  // FORM READY
  // =========================================

  const isBookingReady =
    Boolean(zone) &&
    Boolean(date) &&
    Boolean(resource) &&
    Boolean(time) &&
    Number(duration) > 0;

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!isBookingReady) {
      setError(
        'Заполни все поля бронирования.'
      );
      return;
    }

    try {
      setBookingLoading(true);

      const bookingData = {
        zoneId: zone,
        resourceId: resource,
        date: date
          .toISOString()
          .split('T')[0],
        startTime: time,
        duration: Math.min(
          Number(duration),
          maxDuration
        ),
        game: gameFromUrl || null,
      };

      await createBooking(bookingData);

      setSuccess(
        'Бронирование успешно создано!'
      );

      // Обновляем доступность после бронирования

      const updatedAvailability =
        await getAvailability(
          resource,
          date
            .toISOString()
            .split('T')[0]
        );

      let updatedTimes = [];

      if (Array.isArray(updatedAvailability)) {
        updatedTimes =
          updatedAvailability
            .map((item) => {
              if (
                typeof item === 'string'
              ) {
                return item;
              }

              return item?.time || null;
            })
            .filter(Boolean);
      }

      setAvailableTimes(updatedTimes);

      setTime('');
      setDuration(1);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          'Не удалось создать бронирование. Возможно, выбранное время уже занято.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="booking-page">
      <div className="booking-page__container">

        {/* BACK */}

        <Link
          to="/"
          className="booking-page__back"
        >
          <span>←</span>
          На главную
        </Link>

        {/* HEADER */}

        <div className="booking-page__header">

          <span className="booking-page__eyebrow">
            КИБЕРТЕКА
          </span>

          <h1 className="booking-page__title">
            БРОНИРОВАНИЕ
          </h1>

          {gameFromUrl && (
            <div className="booking-page__game">
              <span>
                ТЫ ХОЧЕШЬ ИГРАТЬ
              </span>

              <strong>
                {decodeURIComponent(
                  gameFromUrl
                )}
              </strong>
            </div>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="booking__message booking__message--error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="booking__message booking__message--success">
            {success}
          </div>
        )}

        <form
          className="booking"
          onSubmit={handleSubmit}
        >

          {/* =================================
              ZONE
          ================================== */}

          <section className="booking__step">

            <div className="booking__step-header">

              <span className="booking__step-number">
                01
              </span>

              <div>
                <span className="booking__step-label">
                  ШАГ 01
                </span>

                <h2>
                  ВЫБЕРИ ЗОНУ
                </h2>
              </div>

            </div>

            {zonesLoading ? (
              <p className="booking__hint">
                Загружаем игровые зоны...
              </p>
            ) : (
              <div className="booking__zones">

                {zones.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`booking__zone ${
                      String(zone) ===
                      String(item.id)
                        ? 'booking__zone--active'
                        : ''
                    }`}
                    onClick={() =>
                      handleZoneChange(
                        item.id
                      )
                    }
                  >

                    <span>
                      {item.name}
                    </span>

                    <small>
                      от {item.price} ₽ / час
                    </small>

                  </button>
                ))}

              </div>
            )}

          </section>

          {/* =================================
              DATE
          ================================== */}

          <section className="booking__step">

            <div className="booking__step-header">

              <span className="booking__step-number">
                02
              </span>

              <div>
                <span className="booking__step-label">
                  ШАГ 02
                </span>

                <h2>
                  ВЫБЕРИ ДАТУ
                </h2>
              </div>

            </div>

            <div className="booking__field">

              <DatePicker
                selected={date}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="dd.MM.yyyy"
                placeholderText="Выберите дату"
                className="booking__date-picker"
              />

            </div>

          </section>

          {/* =================================
              RESOURCE
          ================================== */}

          <section className="booking__step">

            <div className="booking__step-header">

              <span className="booking__step-number">
                03
              </span>

              <div>
                <span className="booking__step-label">
                  ШАГ 03
                </span>

                <h2>
                  ВЫБЕРИ ИГРОВОЕ МЕСТО
                </h2>
              </div>

            </div>

            {!zone ? (
              <p className="booking__hint">
                Сначала выбери игровую зону.
              </p>
            ) : !date ? (
              <p className="booking__hint">
                Сначала выбери дату.
              </p>
            ) : resourcesLoading ? (
              <p className="booking__hint">
                Загружаем игровые места...
              </p>
            ) : resources.length === 0 ? (
              <p className="booking__hint">
                В этой зоне нет игровых мест.
              </p>
            ) : (
              <div className="booking__resources">

                {resources.map((item) => {

                  const isAvailable =
                    item.available !== false;

                  const isActive =
                    String(resource) ===
                    String(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!isAvailable}
                      className={`
                        booking__resource
                        ${
                          isActive
                            ? 'booking__resource--active'
                            : ''
                        }
                        ${
                          !isAvailable
                            ? 'booking__resource--busy'
                            : ''
                        }
                      `}
                      onClick={() =>
                        handleResourceChange(
                          item.id
                        )
                      }
                    >

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {isAvailable
                          ? item.availableFrom &&
                            item.availableTo
                            ? `${item.availableFrom} — ${item.availableTo}`
                            : 'СВОБОДНО'
                          : 'ЗАНЯТО'}
                      </span>

                    </button>
                  );
                })}

              </div>
            )}

          </section>

          {/* =================================
              TIME
          ================================== */}

          <section className="booking__step">

            <div className="booking__step-header">

              <span className="booking__step-number">
                04
              </span>

              <div>
                <span className="booking__step-label">
                  ШАГ 04
                </span>

                <h2>
                  ВЫБЕРИ ВРЕМЯ НАЧАЛА
                </h2>
              </div>

            </div>

            {!resource ? (
              <p className="booking__hint">
                Сначала выбери игровое место.
              </p>
            ) : availabilityLoading ? (
              <p className="booking__hint">
                Проверяем свободное время...
              </p>
            ) : availableTimes.length === 0 ? (
              <p className="booking__hint">
                На выбранную дату свободного времени нет.
              </p>
            ) : (
              <div className="booking__times">

                {availableTimes.map(
                  (availableTime) => (
                    <button
                      key={availableTime}
                      type="button"
                      className={`
                        booking__time
                        ${
                          time === availableTime
                            ? 'booking__time--active'
                            : ''
                        }
                      `}
                      onClick={() =>
                        handleTimeChange(
                          availableTime
                        )
                      }
                    >
                      {availableTime}
                    </button>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================
              DURATION
          ================================== */}

          <section className="booking__step">

            <div className="booking__step-header">

              <span className="booking__step-number">
                05
              </span>

              <div>
                <span className="booking__step-label">
                  ШАГ 05
                </span>

                <h2>
                  ВЫБЕРИ ДЛИТЕЛЬНОСТЬ
                </h2>
              </div>

            </div>

            {!time ? (
              <p className="booking__hint">
                Сначала выбери время начала.
              </p>
            ) : (
              <div className="booking__duration">

                <input
                  type="number"
                  min="1"
                  max={maxDuration}
                  value={duration}
                  onChange={
                    handleDurationChange
                  }
                />

                <span>
                  часа
                </span>

                <small>
                  Максимум: {maxDuration} ч.
                </small>

              </div>
            )}

          </section>

          {/* =================================
              SUMMARY
          ================================== */}

          <div className="booking__summary">

            <div className="booking__summary-info">

              <span>
                ИТОГО
              </span>

              <strong>
                {totalPrice.toLocaleString(
                  'ru-RU'
                )}{' '}
                ₽
              </strong>

            </div>

            <button
              type="submit"
              className="booking__submit"
              disabled={
                !isBookingReady ||
                bookingLoading
              }
            >
              {bookingLoading
                ? 'БРОНИРОВАНИЕ...'
                : 'ЗАБРОНИРОВАТЬ'}

              <span>
                →
              </span>
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}

export default Booking;