import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpenseById, deleteUserExpense } from '../../redux/expenses';
import Comments from '../Comments/Comments';
import './ExpenseDetailPage.css';

function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expense = useSelector(state => state.expenses.currentExpense?.expense);
  const members = useSelector(state => state.expenses.currentExpense?.members);

  useEffect(() => {
    dispatch(getExpenseById(expenseId));
  }, [dispatch, expenseId]);

  const hasSettledMembers = members?.filter(member => member.settled).length > 0;

  const handleDelete = async () => {
    if (hasSettledMembers) {
      alert("Cannot delete expense: some members have already paid");
      return;
    }

    const result = await dispatch(deleteUserExpense(expenseId));

    if (result === true) {
      navigate('/dashboard');
    } else {
      alert("Failed to delete expense");
    }
  }

  return (
    <div className="specific-expense-div">
      <div className="expense-detail-top-header">
        <h1>Expense</h1>
        <div className="expense-detail-expense-buttons">
          <button
            className="expense-detail-edit-button"
          >
            Edit Expense
          </button>
          <button
            className="expense-detail-delete-button"
            onClick={handleDelete}
            disabled={hasSettledMembers}
            >
              Delete Expense
          </button>
          <button className="expense-detail-pay-up-button">Pay Up</button>
        </div>
      </div>

      <div className="expense-details">
        <div className="expense-detail-info">
          <div>{expense?.description}</div>
        </div>

        <span className="expense-detail-amount">
          ${(expense?.expense_members) ? expense.expense_members.reduce((total, member) =>
                total + (parseFloat(member.amount_owed) || 0), 0).toFixed(2) : '0.00'}
        </span>

        <div className="expense-detail-status">
          <p>Status</p>
          <div>{expense?.status}</div>
        </div>

        <div className="expense-detail-date">
          <p>Date</p>
          <div>{expense?.created_at}</div>
        </div>
      </div>

      <div className="expense-detail-members">
        <h2>Expense Members</h2>
        <div className="expense-detail-members">
          {members?.map(member => (
            <div key={member.id} className="expense-detail-specific-member">
              <div className="expense-detail-member-name">{member?.user.firstname} {member?.user?.lastname}</div>
              <div className="expense-detail-member-status">
                {member.settled ? 'settled' : 'unsettled'}
              </div>
              <div className="expense-detail-member-amount">${member.amount_owed}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="expense-detail-expense-comments">
        <Comments />
      </div>
    </div>
  );
}

export default ExpenseDetailPage;
