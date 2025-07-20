const GET_ALL_EXPENSES = 'expenses/GET_EXPENSES';
const GET_SPECIFIC_EXPENSE = 'expenses/GET_SPECIFIC_EXPENSE';

const loadExpenses = (expenses) => ({
  type: GET_ALL_EXPENSES,
  expenses
});

const getSpecificExpense = (expenseData) => ({
  type: GET_SPECIFIC_EXPENSE,
  expenseData
});

export const getExpenses = () => async (dispatch) => {
    try {
      const response = await fetch('/api/expenses/');

      if (response.ok) {
        const data = await response.json();
        dispatch(loadExpenses(data.expenses));
        return data;
      }
      throw new Error('Error loading all expenses');
    }catch(error) {
      return error;
    }
};

export const getExpenseById = (expenseId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`);

      if (response.ok) {
        const data = await response.json();
        dispatch(getSpecificExpense(data));
        return data;
      }
      throw new Error('Error loading expense details');
    }catch(error) {
      return error;
    }
};

const initialState = {
  expenses: {},
  currentExpense: null
};

export default function expensesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_EXPENSES: {
      const expensesState = {};
      action.expenses.forEach(expense => {
          expensesState[expense.id] = expense;
      });
      return {
        ...state,
        expenses: expensesState
      };
    }
    case GET_SPECIFIC_EXPENSE: {
      return {
          ...state,
          currentExpense: action.expenseData
      };
      }
    default:
      return state;
  }
}
