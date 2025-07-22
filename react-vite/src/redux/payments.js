const GET_PAYMENTS = 'payments/GET_PAYMENTS';
const UPDATE_PAYMENT_STATUS = 'payments/UPDATE_PAYMENT_STATUS';

// This is creating an action to load all payments
const loadPayments = (payments) => ({
  type: GET_PAYMENTS,
  payments
});

// This is  creating an action to update one payment
const updatePayment = (payment) => ({
  type: UPDATE_PAYMENT_STATUS,
  payment
});

// This is getting all payments related to a specific expense
export const getPaymentsForExpense = (expenseId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/expenses/${expenseId}/payments`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadPayments(data.payments)); // assuming response: { payments: [...] }
      return data;
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch payments');
    }
  } catch (err) {
    console.error('Error fetching payments:', err);
    return err;
  }
};

// This is updating a single payment’s status (like marking Paid/Unpaid)
export const togglePaymentStatus = (paymentId, status) => async (dispatch) => {
  try {
    const res = await fetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(updatePayment(data));
      return data;
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update payment status');
    }
  } catch (err) {
    console.error('Error updating payment:', err);
    return err;
  }
};

//  this sets the initial Redux state with a payments object
const initialState = {
  payments: {}
};

// This is doing: reducer logic to handle actions and update state
export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENTS: {
      const newPayments = {};
      action.payments.forEach(payment => {
        newPayments[payment.id] = payment;
      });
      return {
        ...state,
        payments: newPayments
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
