import { useReducer, useRef } from 'react';
import { getRooms } from '@/entities/room';
import { getTariffs, createTariff, updateTariff, setTariffActive } from '@/entities/tariff';
import { useRemoteData } from '@/shared/hooks';
import { initialTariffForm, tariffFormReducer } from './tariffFormReducer';

async function loadTariffs(signal) {
  const [rooms, tariffs] = await Promise.all([getRooms(signal), getTariffs(null, signal)]);
  return { rooms, tariffs };
}

export function useTariffsAdmin(active, mutation) {
  const remote = useRemoteData(loadTariffs, { rooms: [], tariffs: [] }, active);
  const [form, dispatch] = useReducer(tariffFormReducer, initialTariffForm);
  const nameRef = useRef(null);
  const reset = () => dispatch({ type: 'reset' });
  const confirm = id => dispatch({ type: 'confirm', id });

  function edit(tariff) {
    dispatch({ type: 'edit', tariff });
    mutation.clear();
    nameRef.current?.focus();
  }

  async function submit(event) {
    event.preventDefault();
    const values = form.values;
    const details = { name: values.name.trim(), price: Number(values.price) };
    if (!details.name) { mutation.setError('Введи название тарифа.'); return; }
    if (!Number.isFinite(details.price) || details.price <= 0) { mutation.setError('Цена должна быть больше нуля.'); return; }
    let action;
    if (form.id !== null) {
      action = () => updateTariff(form.id, details);
    } else {
      const durationMinutes = values.tariffType === 'PACKAGE' ? Number(values.durationMinutes) : null;
      if (values.tariffType === 'PACKAGE' && (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 2147483647)) {
        mutation.setError('Укажи длительность пакета целым числом минут от 1 до 2147483647.');
        return;
      }
      if (!values.roomId) { mutation.setError('Выбери зал.'); return; }
      action = () => createTariff({ ...details, tariffType: values.tariffType, roomId: Number(values.roomId), durationMinutes });
    }
    if (await mutation.run(action, form.id !== null ? 'Тариф сохранён.' : 'Тариф добавлен.')) {
      reset();
      remote.refresh();
    }
  }

  async function setActive(id, active) {
    if (await mutation.run(() => setTariffActive(id, active), active ? 'Тариф включён.' : 'Тариф отключён.')) {
      confirm(null);
      remote.refresh();
    }
  }

  return { ...remote, form, nameRef, edit, reset, confirm, submit, setActive,
    change: event => dispatch({ type: 'change', name: event.target.name, value: event.target.value }) };
}
