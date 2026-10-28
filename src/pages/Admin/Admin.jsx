import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookingsAdmin } from '@/features/booking-management';
import { ComputersAdmin } from '@/features/computer-management';
import { TariffsAdmin } from '@/features/tariff-management';
import { useMutation } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';
import { Feedback } from '@/shared/ui/Feedback';
import styles from './Admin.module.css';

const sections = [
  { id: 'bookings', label: 'Бронирования', Component: BookingsAdmin },
  { id: 'computers', label: 'Компьютеры', Component: ComputersAdmin },
  { id: 'tariffs', label: 'Тарифы', Component: TariffsAdmin },
];

export default function Admin() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('bookings');
  const mutation = useMutation();
  return <main className={styles.admin}>
    <header className={styles.header}>
      <div><Link to="/">← GAMESENSE</Link><h1>Управление клубом</h1><p>{user.name} · Администратор</p></div>
      <Button onClick={logout}>Выйти</Button>
    </header>
    <nav className={styles.tabs} aria-label="Разделы управления">
      {sections.map(({ id, label }) => <Button key={id} aria-current={tab === id ? 'page' : undefined}
        disabled={mutation.busy} onClick={() => { setTab(id); mutation.clear(); }}>{label}</Button>)}
    </nav>
    <Feedback kind="success">{mutation.notice}</Feedback>
    <Feedback kind="error">{mutation.error}</Feedback>
    {sections.map(({ id, Component }) => <div key={id} hidden={tab !== id}>
      <Component active={tab === id} mutation={mutation} />
    </div>)}
  </main>;
}
