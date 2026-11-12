
import { useState, useEffect } from 'react';

import ZoneCard from './ZoneCard';
import './ZonesSection.css';

import localZones from '../../data/zones';
import { getRooms, matchRoom } from '@/entities/room';
import { apiError } from '@/shared/api';

function ZonesSection() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getRooms(controller.signal)
      .then(data => {
        setRooms(data);
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(apiError(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Объединяем данные из БД с локальными характеристиками и изображениями
  const zones = localZones
    .map(localZone => {
      const room = matchRoom(rooms, localZone.id);

      if (!room) return null;

      return {
        ...localZone,
        id: room.id,
        name: room.name,
        description: room.description,
      };
    })
    .filter(Boolean);

  return (
    <section className="zones" id="zones">
      <div className="zones__container">

        <div className="zones__header">
          <span className="zones__eyebrow">
            НАШИ ЗОНЫ
          </span>

          <h2 className="zones__title">
            РАЗНЫЕ ЗОНЫ
            <br />
            <span>С РАЗНЫМИ УСЛОВИЯМИ</span>
          </h2>

          <p className="zones__description">
            Выбери игровое место, которое подходит именно тебе.
          </p>
        </div>

        {loading && (
          <p>Загружаем игровые зоны...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && zones.length === 0 && (
          <p>Игровые зоны пока не найдены.</p>
        )}

        {!loading && !error && zones.length > 0 && (
          <div className="zones__grid">
            {zones.map(zone => (
              <ZoneCard
                key={zone.id}
                {...zone}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ZonesSection;
