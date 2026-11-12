import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTransactions } from '@/entities/wallet/api';
import { useWallet } from '@/entities/wallet/useWallet';
import { apiError } from '@/shared/api';
import { money, displayDateTime } from '@/utils/booking';
import './Wallet.css';

const labels = { TOP_UP: 'Пополнение', BOOKING_PAYMENT: 'Оплата брони', REFUND: 'Возврат', ADMIN_ADJUSTMENT: 'Корректировка' };
export default function WalletPanel() {
  const { user } = useAuth();
  const wallet = useWallet();
  const [version, setVersion] = useState(0);
  const [historyResult, setHistory] = useState({ items: [], loading: true, error: '' });
  const history = historyResult.userId === user.id && historyResult.version === version
    ? historyResult : { items: [], loading: true, error: '' };
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') setVersion(value => value + 1); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getTransactions(controller.signal).then(items => { if (!controller.signal.aborted) setHistory({ items, loading: false, error: '', userId: user.id, version }); })
      .catch(error => { if (!controller.signal.aborted) setHistory({ items: [], loading: false, error: apiError(error), userId: user.id, version }); });
    return () => controller.abort();
  }, [user.id, version]);
  return <section className="wallet-panel" aria-label="Кошелёк">
    <div className="wallet-panel__balance"><div><h2>Мой баланс</h2>
      {wallet.loading ? <p role="status">Загружаем баланс…</p> : wallet.error ? <p role="alert">{wallet.error}</p> : <strong>{money(wallet.balance)}</strong>}
      </div>
      <button className="profile-refresh" type="button" disabled={wallet.loading || history.loading} onClick={() => { wallet.refresh(); setVersion(value => value + 1); }}>Обновить кошелёк</button></div>
    <h3>История операций</h3>
    {history.loading && <p role="status">Загружаем операции…</p>}
    {history.error && <p role="alert">{history.error}</p>}
    {!history.loading && !history.error && !history.items.length && <p>Операций пока нет. Пополни баланс у администратора, чтобы оплатить первую бронь.</p>}
    <div className="wallet-panel__history">{history.items.map(item => <article className="wallet-operation" key={item.id}>
      <div><h4>{labels[item.type] || 'Операция по балансу'}</h4><p>{displayDateTime(item.createdAt)} (МСК){item.bookingId != null && ` · Бронь №${item.bookingId}`}</p><p>{item.description}</p></div>
      <div><strong>{Number(item.balanceAfter) - Number(item.balanceBefore) > 0 ? '+' : Number(item.balanceAfter) - Number(item.balanceBefore) < 0 ? '−' : ''}{money(Math.abs(Number(item.amount)))}</strong><p>Остаток: {money(item.balanceAfter)}</p></div>
    </article>)}</div>
  </section>;
}
