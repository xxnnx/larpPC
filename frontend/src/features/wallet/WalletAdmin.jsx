import { useState } from 'react';
import { topUp } from '@/entities/wallet/api';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { money } from '@/shared/utils';
import styles from '@/shared/ui/ManagementSection/layout.module.css';

export default function WalletAdmin({ mutation }) {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  function prepare(event) {
    event.preventDefault();
    if (!Number.isSafeInteger(Number(userId)) || Number(userId) <= 0 || !/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || Number(amount) > 99999999.99) {
      mutation.setError('Укажи положительный целый ID и сумму от 0,01 до 99 999 999,99 ₽.'); return;
    }
    mutation.clear();
    setConfirmation({ userId: Number(userId), amount: Number(amount) });
  }
  async function confirm() {
    const details = confirmation;
    const success = await mutation.run(() => topUp(details.userId, details.amount), `Баланс пользователя №${details.userId} пополнен на ${money(details.amount)}.`);
    setConfirmation(null);
    if (success) { setAmount(''); setUserId(''); }
  }
  return <section><h2>Пополнение баланса</h2><p>Укажи ID клиента для пополнения его баланса.</p>
    <form onSubmit={prepare}><fieldset className={styles.fieldset} disabled={mutation.busy || confirmation !== null}>
      <div className={styles.fields}><Field label="ID пользователя" type="number" min="1" step="1" required value={userId} onChange={event => setUserId(event.target.value)} />
      <Field label="Сумма, ₽" type="number" min="0.01" max="99999999.99" step="0.01" required value={amount} onChange={event => setAmount(event.target.value)} /></div>
      <Button type="submit">Пополнить баланс</Button>
    </fieldset></form>
    {confirmation && <div role="group" aria-label="Подтверждение пополнения"><p>Зачислить {money(confirmation.amount)} пользователю №{confirmation.userId}? Проверь ID клиента.</p>
      <div className={styles.actions}><Button disabled={mutation.busy} onClick={confirm}>{mutation.busy ? 'Пополняем…' : 'Подтвердить пополнение'}</Button><Button disabled={mutation.busy} onClick={() => setConfirmation(null)}>Назад</Button></div></div>}
    <p>Если ответ сервера потерян, попроси клиента обновить кошелёк и проверить историю перед повторным пополнением.</p>
  </section>;
}
