import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getExpenseById } from '../../redux/expenses';
import PaymentsList from '../redux/PaymentsList'; 
// import './ExpenseDetailPage.css';

function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const dispatch = useDispatch();
  const expense = useSelector(state => state.expenses.currentExpense?.expense);
  const members = useSelector(state => state.expenses.currentExpense?.members);

  useEffect(() => {
    dispatch(getExpenseById(expenseId));
  }, [dispatch, expenseId]);

  return (
    <div className="specific-expense-div">
      <div className="expense-top-header">
        <h1>Expense</h1>
        <div className="expense-buttons">
          <button className="edit-button">Edit Expense</button>
          <button className="delete-button">Delete Expense</button>
          <button className="pay-up-button">Pay Up</button>
        </div>
      </div>

      <div className="expense-details">
        <div className="expense-info">
          <div>{expense?.description}</div>
        </div>

        <div className="expense-amount">
          <p>Amount</p>
          <div>${expense?.amount}</div>
        </div>

        <div className="expense-status">
          <p>Status</p>
          <div>{expense?.status}</div>
        </div>

        <div className="expense-date">
          <p>Date</p>
          <div>{expense?.created_at}</div>
        </div>
      </div>

      <div className="expense-members">
        <h2>Expense Members</h2>
        <div className="members">
          {members?.map(member => (
            <div key={member.id} className="specific-member">
              <div className="member-name">{member?.user_id}</div> {/* fix add user model to expense members? */}
              <div className="member-status">
                {member.settled ? 'settled' : 'unsettled'}
              </div>
              <div className="member-amount">${member.amount_owed}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetailPage;
