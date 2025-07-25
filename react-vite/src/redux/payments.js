// Action Types
const LOAD_PAYMENTS = 'payments/LOAD_PAYMENTS';
const LOAD_HISTORY = 'payments/LOAD_HISTORY';
const UPDATE_PAYMENT = 'payments/UPDATE_PAYMENT';
const LOAD_SUMMARY = 'payments/LOAD_SUMMARY';

// Initial State
const initialState = {
  paymentsByExpense: {},
  userHistory: {},
  summary: {
    totalPaid: 0,
    totalUnpaid: 0
  }
};

// Reducer
export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PAYMENTS: {
      const normalizedPayments = {};
      action.payments.forEach(payment => {
        normalizedPayments[payment.id] = payment;
      });
      return { 
        ...state, 
        paymentsByExpense: normalizedPayments 
      };
    }
    
    case LOAD_HISTORY: {
      const normalizedHistory = {};
      action.payments.forEach(payment => {
        normalizedHistory[payment.id] = payment;
      });
      return { 
        ...state, 
        userHistory: normalizedHistory 
      };
    }

    case UPDATE_PAYMENT:
      return {
        ...state,
        paymentsByExpense: {
          ...state.paymentsByExpense,
          [action.payment.id]: action.payment
        },
        userHistory: {
          ...state.userHistory,
          [action.payment.id]: action.payment
        }
      };

    case LOAD_SUMMARY:
      return { 
        ...state, 
        summary: action.payload 
      };

    default:
      return state;
  }
}

// Action Creators
export const getPaymentSummary = () => async (dispatch) => {
  const response = await fetch('/api/payments/summary');
  if (response.ok) {
    const data = await response.json();
    dispatch({ 
      type: LOAD_SUMMARY, 
      payload: data 
    });
  }
};

export const getUserPaymentHistory = () => async (dispatch) => {
  const response = await fetch('/api/payments/history');
  if (response.ok) {
    const data = await response.json();
    dispatch({
      type: LOAD_HISTORY,
      payments: data
    });
  }
};

export const getExpenseById = (expenseId) => async (dispatch) => {
  const response = await fetch(`/api/expenses/${expenseId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch({
      type: 'expenses/LOAD_EXPENSE', // Update this to match your expenses action type
      expense: data
    });
  }
};