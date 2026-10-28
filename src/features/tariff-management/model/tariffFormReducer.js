export const initialTariffForm = {
  id: null, deactivateId: null,
  values: { roomId: '', name: '', tariffType: 'HOURLY', price: '', durationMinutes: '' },
};

export function tariffFormReducer(state, action) {
  switch (action.type) {
    case 'change': return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'edit': {
      const { id, name, price, roomId, tariffType, durationMinutes } = action.tariff;
      return { id, deactivateId: null, values: { name, price, roomId, tariffType, durationMinutes: durationMinutes ?? '' } };
    }
    case 'confirm': return { ...state, deactivateId: action.id };
    case 'reset': return { ...initialTariffForm, deactivateId: state.deactivateId };
    default: return state;
  }
}
