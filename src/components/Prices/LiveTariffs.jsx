import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTariffs, apiError } from '../../api/bookingApi';
import { money } from '../../utils/booking';

export default function LiveTariffs({ roomName }) {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getTariffs(null, controller.signal).then(data => setTariffs(data.filter(item => item.active)))
      .catch(err => { if (!controller.signal.aborted) setError(apiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retry]);
  if (loading) return <p role="status">Загружаем тарифы…</p>;
  if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Повторить</button></div>;
  const normalize = value => String(value || '').toLowerCase().replace(/\s/g, '');
  const visible = roomName ? tariffs.filter(item => normalize(item.roomName) === normalize(roomName)) : tariffs;
  if (!visible.length) return <p>Актуальные тарифы пока не добавлены. Уточни стоимость у администратора.</p>;
  const groups = Object.groupBy(visible, item => item.roomId);
  return <div className="prices__grid">{Object.entries(groups).map(([roomId, items]) =>
    <article className="prices__card" key={roomId}><h3>{items[0].roomName}</h3><dl>{[...items].sort((a, b) =>
      Number(b.tariffType === 'HOURLY') - Number(a.tariffType === 'HOURLY')
      || Number(a.durationMinutes || 60) - Number(b.durationMinutes || 60)
      || Number(a.price) - Number(b.price)
    ).map(item =>
      <div key={item.id}><dt>{item.tariffType === 'HOURLY' ? '1 час' : item.name}</dt><dd>{money(item.price)}</dd></div>
    )}</dl><Link to={'/booking?room=' + roomId}>Выбрать место ↗</Link></article>
  )}</div>;
}
