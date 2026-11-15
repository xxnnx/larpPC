import { useReducer, useRef } from 'react';
import { getRooms } from '@/entities/room';
import { getComputersInRooms, saveComputer } from '@/entities/computer';
import { useRemoteData } from '@/shared/hooks';
import { computerFormReducer, initialComputerForm } from './computerFormReducer';

async function loadComputers(signal) {
  const rooms = await getRooms(signal);
  return { rooms, computers: await getComputersInRooms(rooms, signal) };
}

export function useComputersAdmin(active, mutation) {
  const remote = useRemoteData(loadComputers, { rooms: [], computers: [] }, active);
  const [form, dispatch] = useReducer(computerFormReducer, initialComputerForm);
  const nameRef = useRef(null);
  const reset = () => dispatch({ type: 'reset' });

  function edit(computer) {
    dispatch({ type: 'edit', computer });
    mutation.clear();
    nameRef.current?.focus();
  }

  async function submit(event) {
    event.preventDefault();
    const values = form.values;
    if (!values.name.trim()) { mutation.setError('Введи название компьютера.'); return; }
    const details = { ...values, name: values.name.trim(), number: Number(values.number), roomId: Number(values.roomId) };
    if (await mutation.run(() => saveComputer(form.id, details), 'Компьютер сохранён.')) {
      reset();
      remote.refresh();
    }
  }

  return { ...remote, form, nameRef, edit, reset, submit,
    change: event => dispatch({ type: 'change', name: event.target.name, value: event.target.value }) };
}
