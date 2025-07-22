const GET_PAYMENTS = 'payments/GET_PAYMENTS';
const UPDATE_PAYMENT_STATUS = 'payments/UPDATE_PAYMENT_STATUS';

const loadPayments = (payments) => ({
  type: GET_PAYMENTS,
  payments
});

const updatePayment = (payment) => ({
  type: UPDATE_PAYMENT_STATUS,
  payment
});

// I believe this fetches all payments related to a specific expense
export const getPaymentsForExpense = (expenseId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/expenses/${expenseId}/payments`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadPayments(data));
      return data;
    }
    throw new Error("Failed to fetch payments");
  } catch (err) {
    return err;
  }
};

// I believe this updates a payment's status (paid/unpaid)
export const togglePaymentStatus = (paymentId, status) => async (dispatch) => {
  try {
    const res = await fetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(updatePayment(data));
      return data;
    }
    throw new Error("Failed to update payment status");
  } catch (err) {
    return err;
  }
};

const initialState = {
  payments: {}
};

export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENTS: {
      const newState = {};
      action.payments.forEach(payment => {
        newState[payment.id] = payment;
      });
      return {
        ...state,
        payments: newState
      };
    }
    case UPDATE_PAYMENT_STATUS: {
      return {
        ...state,
        payments: {
          ...state.payments,
          [action.payment.id]: {
            ...state.payments[action.payment.id],
            status: action.payment.status
          }
        }
      };
    }
    default:
      return state;
  }
}
