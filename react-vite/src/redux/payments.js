// payments.js

// I believe these are the action types for payments
const LOAD_PAYMENTS = 'payments/LOAD_PAYMENTS';
const LOAD_HISTORY = 'payments/LOAD_HISTORY';
const UPDATE_PAYMENT = 'payments/UPDATE_PAYMENT';
const LOAD_SUMMARY = 'payments/LOAD_SUMMARY'; // New action type for summary

// I believe this is the initial state setup
const initialState = {
  paymentsByExpense: {},  // Stores payments grouped by expense
  userHistory: {},        // Stores user's payment history
  summary: {              // Stores payment summary stats
    totalPaid: 0, 
    totalUnpaid: 0 
  }
};

// I believe this is the main reducer function
export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    // I believe this handles loading payments for a specific expense
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
    
    // I believe this handles loading user payment history
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

    // I believe this handles updating a payment status
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

    // I believe this handles loading payment summary stats
    case LOAD_SUMMARY:
      return { 
        ...state, 
        summary: action.payload 
      };

    default:
      return state;
  }
}

// I believe this fetches payment summary from the backend
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