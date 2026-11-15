import { computerStatuses } from '@/entities/computer';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { ManagementSection } from '@/shared/ui/ManagementSection';
import styles from '@/shared/ui/ManagementSection/layout.module.css';
import { useComputersAdmin } from '../model/useComputersAdmin';

export default function ComputersAdmin({ active, mutation }) {
  const { nameRef, ...model } = useComputersAdmin(active, mutation);
  const { rooms, computers } = model.data;
  const { id, values } = model.form;
  const busy = mutation.busy || model.loading;
  return <ManagementSection title="Компьютеры" loading={model.loading} error={model.error} busy={mutation.busy} onRefresh={model.refresh}>
    <form onSubmit={model.submit}>
      <fieldset className={styles.fieldset} disabled={busy || !rooms.length}>
        <legend>{id !== null ? 'Редактирование компьютера' : 'Добавить компьютер'}</legend>
        <div className={styles.fields}>
          <Field label="Номер" name="number" type="number" min="1" max="2147483647" step="1" required readOnly={id !== null} value={values.number} onChange={model.change} />
          <Field label="Название" name="name" ref={nameRef} required value={values.name} onChange={model.change} />
          <Field as="select" label="Зал" name="roomId" required value={values.roomId} onChange={model.change}>
            <option value="">Выбери зал</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </Field>
          <Field as="select" label="Состояние" name="status" value={values.status} onChange={model.change}>
            {Object.entries(computerStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </Field>
        </div>
        {id !== null && <p>Номер существующего компьютера пока нельзя изменить.</p>}
        <div className={styles.actions}>
          <Button type="submit">{mutation.busy ? 'Сохраняем…' : 'Сохранить компьютер'}</Button>
          {id !== null && <Button onClick={model.reset}>Отменить редактирование</Button>}
        </div>
      </fieldset>
    </form>
    <div className={styles.list}>{computers.map(place => <article key={place.id} className={styles.row}>
      <div><h3>№{place.number} · {place.name}</h3><p>{place.roomName} · {computerStatuses[place.status] || place.status}</p></div>
      <Button disabled={busy} onClick={() => model.edit(place)}>Редактировать</Button>
    </article>)}</div>
    {!model.error && !computers.length && <p>Компьютеров пока нет.</p>}
    {!model.error && !rooms.length && <p>Залы пока не добавлены. Сначала добавь их в базу данных.</p>}
  </ManagementSection>;
}

