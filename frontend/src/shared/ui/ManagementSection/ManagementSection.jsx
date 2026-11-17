import { Button } from '../Button';
import { Feedback } from '../Feedback';
import styles from './ManagementSection.module.css';

export default function ManagementSection({ title, loading, error, busy, onRefresh, children }) {
  return <section className={styles.section} aria-busy={loading || busy}>
    <div className={styles.toolbar}><div><h2>{title}</h2><p>Время клуба · Москва, UTC+3</p></div><Button disabled={loading || busy} onClick={onRefresh}>Обновить</Button></div>
    <Feedback>{error}</Feedback>
    {loading && <p role="status">Загружаем данные…</p>}
    <div hidden={loading}>{children}</div>
  </section>;
}
