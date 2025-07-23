const GET_ALL_EXPENSES = 'expenses/GET_EXPENSES';
const GET_SPECIFIC_EXPENSE = 'expenses/GET_SPECIFIC_EXPENSE';
const CREATE_EXPENSE = 'expense/CREATE_EXPENSE'

const loadExpenses = (expenses) => ({
  type: GET_ALL_EXPENSES,
  expenses
});

const getSpecificExpense = (expenseData) => ({
  type: GET_SPECIFIC_EXPENSE,
  expenseData
});

const createNewExpense = (expense) => ({
  type: CREATE_EXPENSE,
  expense
})

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
    }catch(error){
      return error;
    }
};

export const createExpense = (expenseData) => async (dispatch) => {
  try {
    const response = await fetch('/api/expenses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expenseData)
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createNewExpense(data.expense));
      return {data};
    } else {
      const errors = await response.json();
      return errors;
    }
  } catch (error){
    return { errors: error.message };
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
    case CREATE_EXPENSE: {
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [action.expense.id]: action.expense
        }
      }
    }
    default:
      return state;
  }
}
