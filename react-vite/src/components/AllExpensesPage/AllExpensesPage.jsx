import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenses } from '../../redux/expenses';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useModal } from "../../context/Modal";
import ExpenseMembersModal from '../ExpenseMembersModal/ExpenseMembersModal';

function AllExpensesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const expenses = useSelector(state => Object.values(state.expenses.expenses));
  const rawExpenses = useSelector(state => state.expenses.expenses);
  const expenseList = useMemo(() => Object.values(rawExpenses), [rawExpenses]);
  const { setModalContent } = useModal();

  const openExpenseModal = () => {
    setModalContent(<ExpenseMembersModal />);
  };

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  return (
  <div className="all-expenses-list">
    <div className="expenses-header">
      <h1>All Expenses</h1>
      <button className="add-expense-button" onClick={openExpenseModal}>Add an Expense</button> {/* place holder click button for modal*/}
    </div>

    <div className="expenses-list">
      {expenseList.map(expense => (
        /* clickable expense component/card */
        <div
          key={expense.id} className="expense-component" onClick={() => navigate(`/expenses/${expense.id}`)}>
          <div className="expense-description">
            <p>{expense?.description}</p>
            <span className="expense-amount">${expense?.amount}</span>
          </div>

          <div className="expense-card-details">
            <div className="expense-info">
              <p>Created by: {expense?.expense_owner}</p>
              <p>Status: {expense?.status}</p>
            </div>
            <div className="expense-date">
              {expense?.created_at}
            </div>
          </div>

          <div className="expense-members">
            {expense?.expense_members?.map(member => (
              <div key={member?.id} className="member-row">
                <span>{member?.user_id}</span> {/* add user to member? */}
                <span className={`expense-card-status ${member?.settled ? 'settled' : 'pending'}`}> {/* custom class for status coloring (green if settled, red if not) */}
                  <p>Status: {member?.settled ? 'settled' : 'pending'}</p>
                </span>
                <span>${member?.amount_owed}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default AllExpensesPage;
