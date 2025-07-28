// Action Types
const LOAD_PAYMENTS = 'payments/LOAD_PAYMENTS';
const LOAD_HISTORY = 'payments/LOAD_HISTORY';
const UPDATE_PAYMENT = 'payments/UPDATE_PAYMENT';
const PAY_EXPENSE = 'payments/PAY_EXPENSE';

// Action Creators
const loadPayments = (payments) => ({
  type: LOAD_PAYMENTS,
  payments
});

const loadHistory = (payments) => ({
  type: LOAD_HISTORY,
  payments
});

const updatePayment = (payment) => ({
  type: UPDATE_PAYMENT,
  payment
});

const payExpense = (payment) => ({
  type: PAY_EXPENSE,
  payment
});

// Thunk Actions
export const getPaymentsByExpense = (expenseId) => async (dispatch) => {
  const res = await fetch(`/api/expenses/${expenseId}/payments`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadPayments(data));
    return data;
  }
};

export const getUserPaymentHistory = () => async (dispatch) => {
  const res = await fetch('/api/payments/history');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadHistory(data));
    return data;
  }
};


export const updatePaymentStatus = (paymentId, status) => async (dispatch) => {
  const res = await fetch(`/api/payments/${paymentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (res.ok) {
    const updatedPayment = await res.json();
    dispatch(updatePayment(updatedPayment));
    return updatedPayment;
  }
};

export const submitExpensePayment = (expenseId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/payments/expenses/${expenseId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(payExpense(data));
      return data;
    }
    throw new Error('Error creating payment');
  } catch (error) {
    return { errors: error.message };
  }
};

// Initial State
const initialState = {
  paymentsByExpense: [],  // Payments grouped by expense
  userHistory: []         // All payments for current user
};

// Reducer
export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PAYMENTS:
      return {
        ...state,
        paymentsByExpense: action.payments
      };

    case LOAD_HISTORY:
      return {
        ...state,
        userHistory: action.payments
      };

    case UPDATE_PAYMENT:
      return {
        ...state,
        paymentsByExpense: state.paymentsByExpense.map(payment =>
          payment.id === action.payment.id ? action.payment : payment
        ),
        userHistory: state.userHistory.map(payment =>
          payment.id === action.payment.id ? action.payment : payment
        )
      };

      case PAY_EXPENSE:
      return {
        ...state,
        userHistory: [...state.userHistory, action.payment.payment]
      };

    default:
      return state;
  }
}
