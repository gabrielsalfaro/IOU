// I believe this is setting up Redux to handle all payments-related actions

const LOAD_PAYMENTS = 'payments/LOAD_PAYMENTS';
const LOAD_HISTORY = 'payments/LOAD_HISTORY';
const UPDATE_PAYMENT = 'payments/UPDATE_PAYMENT';

// I believe this is the action to store all payments for an expense
const loadPayments = (payments) => ({
  type: LOAD_PAYMENTS,
  payments
});

// I believe this is the action to store a user's payment history
const loadHistory = (payments) => ({
  type: LOAD_HISTORY,
  payments
});

// I believe this is the action to update one payment (like marking it paid)
const updatePayment = (payment) => ({
  type: UPDATE_PAYMENT,
  payment
});

// I believe this is getting all payments for a specific expense
export const getPaymentsByExpense = (expenseId) => async (dispatch) => {
  const res = await fetch(`/api/expenses/${expenseId}/payments`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadPayments(data));
    return data;
  }
};

// I believe this is getting the logged-in user's payment history
export const getUserPaymentHistory = () => async (dispatch) => {
  const res = await fetch('/api/payments/history');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadHistory(data));
    return data;
  }
};

// I believe this is updating a single payment status (like marking it paid)
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

// I believe this is the initial state setup
const initialState = {
  paymentsByExpense: [],
  userHistory: []
};

// I believe this is the reducer for payments
export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PAYMENTS:
      return { ...state, paymentsByExpense: action.payments };

    case LOAD_HISTORY:
      return { ...state, userHistory: action.payments };

    case UPDATE_PAYMENT:
      return {
        ...state,
        paymentsByExpense: state.paymentsByExpense.map(payment =>
          payment.id === action.payment.id ? { ...payment, ...action.payment } : payment
        ),
        userHistory: state.userHistory.map(payment =>
          payment.id === action.payment.id ? { ...payment, ...action.payment } : payment
        )
      };

    default:
      return state;
  }
}
