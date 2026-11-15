import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { ManagementSection } from '@/shared/ui/ManagementSection';
import styles from '@/shared/ui/ManagementSection/layout.module.css';
import { money } from '@/shared/utils';
import { useTariffsAdmin } from '../model/useTariffsAdmin';

export default function TariffsAdmin({ active, mutation }) {
  const { nameRef, ...model } = useTariffsAdmin(active, mutation);
  const { rooms, tariffs } = model.data;
  const { id, values, deactivateId } = model.form;
  const editing = id !== null;
  const busy = mutation.busy || model.loading;
  return <ManagementSection title="Тарифы" loading={model.loading} error={model.error} busy={mutation.busy} onRefresh={model.refresh}>
    <form onSubmit={model.submit}>
      <fieldset className={styles.fieldset} disabled={busy || (!editing && !rooms.length)}>
        <legend>{editing ? 'Редактирование тарифа' : 'Добавить тариф'}</legend>
        <div className={styles.fields}>
          <Field label="Название" ref={nameRef} name="name" required value={values.name} onChange={model.change} />
          <Field as="select" label="Зал" name="roomId" required disabled={editing} value={values.roomId} onChange={model.change}>
            <option value="">Выбери зал</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </Field>
          <Field as="select" label="Тип" name="tariffType" disabled={editing} value={values.tariffType} onChange={model.change}>
            <option value="HOURLY">Почасовой</option><option value="PACKAGE">Пакет</option>
          </Field>
          <Field label={values.tariffType === 'HOURLY' ? 'Цена за час, ₽' : 'Цена пакета, ₽'} name="price" type="number" min="0.01" step="0.01" required value={values.price} onChange={model.change} />
          {values.tariffType === 'PACKAGE' && <Field label="Длительность, минут" name="durationMinutes" type="number" min="1" max="2147483647" step="1" required readOnly={editing} value={values.durationMinutes} onChange={model.change} />}
        </div>
        {editing && <p>Можно изменить название и цену. Для другого зала, типа или длительности создай новый тариф.</p>}
        <div className={styles.actions}>
          <Button type="submit">{mutation.busy ? 'Сохраняем…' : editing ? 'Сохранить тариф' : 'Добавить тариф'}</Button>
          {editing && <Button onClick={model.reset}>Отменить редактирование</Button>}
        </div>
      </fieldset>
    </form>
    <div className={styles.list}>{tariffs.map(item => <article className={styles.row} key={item.id}>
      <div><h3>{item.name}</h3><p>{item.roomName || rooms.find(room => room.id === item.roomId)?.name} · {item.tariffType === 'HOURLY' ? 'Почасовой' : `${item.durationMinutes} мин`}</p></div>
      <div>
        <strong>{money(item.price)}{item.tariffType === 'HOURLY' ? ' / час' : ''}</strong><p>{item.active ? 'Активен' : 'Отключён'}</p>
        <div className={styles.actions}>
          <Button disabled={busy} onClick={() => model.edit(item)}>Редактировать</Button>
          {item.active ? deactivateId === item.id ? <>
            <span>Отключить «{item.name}» для новых бронирований?</span>
            <Button disabled={busy} onClick={() => model.setActive(item.id, false)}>Да, отключить</Button>
            <Button disabled={busy} onClick={() => model.confirm(null)}>Назад</Button>
          </> : <Button disabled={busy} onClick={() => model.confirm(item.id)}>Отключить</Button>
            : <Button disabled={busy} onClick={() => model.setActive(item.id, true)}>Включить</Button>}
        </div>
      </div>
    </article>)}</div>
    {!model.error && !tariffs.length && <p>Тарифов пока нет.</p>}
    {!model.error && !rooms.length && <p>Залы пока не добавлены. Сначала добавь их в базу данных.</p>}
  </ManagementSection>;
}

