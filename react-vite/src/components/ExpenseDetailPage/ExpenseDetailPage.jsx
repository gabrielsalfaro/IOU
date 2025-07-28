import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import { getExpenseById, deleteUserExpense, editExpense } from '../../redux/expenses';
import Comments from '../Comments/Comments';
import PaymentModal from '../PaymentModal/PaymentModal';
import EditExpenseModal from '../EditExpenseModal/EditExpenseModal';
import ErrorModal from '../ErrorModal/ErrorModal';
import './ExpenseDetailPage.css';

function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const expense = useSelector(state => state.expenses.currentExpense?.expense);
  const members = useSelector(state => state.expenses.currentExpense?.members);
  const isOwner = expense?.expense_owner === sessionUser?.id;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getExpenseById(expenseId));
  }, [dispatch, expenseId]);

  const hasSettledMembers = () => {
    for (let member of members) {
      if ((member?.user_id !== expense?.expense_owner) && member?.settled) {
        return true;
      }
    }
    return false;
  };

  const handleEdit = async () => {
    if(!isOwner) {
      setModalContent(<ErrorModal message="You can only edit expenses you created"/>);
      return;
    }

    if(expense.status === "settled"){
      setModalContent(<ErrorModal message="Cannot edit expense: Expense has been settled"/>);
      return;
    }

    if (hasSettledMembers()) {
      setModalContent(<ErrorModal message="Cannot edit expense: some members have already paid"/>);
      return;
    }

    setModalContent(<EditExpenseModal expense={expense} members={members} />)
  }

  const handleDelete = async () => {
    if(!isOwner) {
      setModalContent(<ErrorModal message="You can only delete expenses you created"/>);
      return;
    }

    if(expense.status === "settled"){
      setModalContent(<ErrorModal message="Cannot delete expense: Expense has been settled"/>);
      return;
    }

    if (hasSettledMembers()) {
      setModalContent(<ErrorModal message="Cannot delete expense: some members have already paid"/>);
      return;
    }

    const result = await dispatch(deleteUserExpense(expenseId));

    if (result === true) {
      navigate('/dashboard');
    } else {
      setModalContent(<ErrorModal message="Failed to delete expense"/>);
    }
  }

  const handlePaymentSubmit = async () => {
    if (expense?.status === "open") {
      await dispatch(editExpense(expense.id, { description: expense.description, status: "settled" }));
      dispatch(getExpenseById(expenseId));
      setShowPaymentModal(false);
      setShowComingSoon(false);
      setShowPaymentConfirmation(true);
      setTimeout(() => setShowPaymentConfirmation(false), 3000);
    } else {
      setShowPaymentModal(false);
      setShowComingSoon(false);
    }
  };

  return (
    <div className="specific-expense-div">
      {showPaymentConfirmation && (
        <div className="confirmation-dropdown">
          <p>Expense payment has been settled.</p>
          <button className="close-btn" onClick={() => setShowPaymentConfirmation(false)}>×</button>
        </div>
      )}

      <div className="expense-detail-top-header">
        <h1>Expense</h1>
        <div className="expense-detail-expense-buttons">
          <button
            className="expense-detail-edit-button"
            onClick={handleEdit}
          >
            Edit Expense
          </button>
          <button
            className="expense-detail-delete-button"
            onClick={handleDelete}
          >
            Delete Expense
          </button>
          <button
            className="expense-detail-pay-up-button"
            onClick={() => setShowPaymentModal(true)}
          >
            Pay Up
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          expenseId={expenseId}
          onClose={() => {
            setShowPaymentModal(false);
            setShowComingSoon(false);
          }}
          onSubmit={handlePaymentSubmit}
          showComingSoon={showComingSoon}
        />
      )}

      <div className="expense-details">
        <div className="expense-detail-info">
          <div>{expense?.description}</div>

          <span className="expense-amount">
            ${(expense?.expense_members) ? expense.expense_members.reduce((total, member) =>
                  total + (parseFloat(member.amount_owed) || 0), 0).toFixed(2) : '0.00'}
          </span>
        </div>

        <div className="expense-detail-status-message">
          Status
          <span className={`expense-detail-status ${expense?.status === 'settled' ? 'settled' : 'pending'}`}>
            {expense?.status}
          </span>
        </div>

        <div className="expense-detail-date">
          <p>Date</p>
          <div>{new Date(expense?.created_at).toLocaleString()}</div>
        </div>
      </div>

      <div className="expense-detail-members">
        <h2>Expense Members</h2>
        <div className="expense-detail-members">
          {members?.map(member => (
            <div key={member.id} className="expense-detail-specific-member">
              <div className="expense-detail-member-name">{member?.user.firstname} {member?.user?.lastname}</div>
              <span className={`expense-detail-member-status ${member.settled ? 'settled' : 'unsettled'}`}>
                {member.settled ? 'settled' : 'unsettled'}
              </span>
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
