export const initialComputerForm = { id: null, values: { number: '', name: '', roomId: '', status: 'AVAILABLE' } };

export function computerFormReducer(state, action) {
  switch (action.type) {
    case 'change': return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'edit': {
      const { id, number, name, roomId, status } = action.computer;
      return { id, values: { number, name, roomId, status } };
    }
    case 'reset': return initialComputerForm;
    default: return state;
  }
}
