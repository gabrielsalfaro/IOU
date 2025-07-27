import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { editExpense } from '../../redux/expenses';
import './EditExpenseModal.css';

function ExpenseEditModal({ expense, members }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});

  const isOwner = expense?.expense_owner === sessionUser?.id;
  const isSettled = expense.status === 'settled';

  useEffect(() => {
    if (!isOwner) {
      alert("You can only edit expenses you created");
      closeModal();
      return;
    }

    if (isSettled) {
      alert("Cannot edit expense: Expense has been settled");
      closeModal();
      return;
    }
  }, [isOwner, isSettled, closeModal]);

  const hasSettledMembers = () => {
      for (let member of members) {
        if ((member?.user_id !== expense?.expense_owner) && member?.settled) {
          return true;
        }
      }
      return false;
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      description,
      ...((!hasSettledMembers() && amount) && { amount: parseFloat(amount).toFixed(2)})
    }

    const result = await dispatch(editExpense(expense.id, data));

    if (!result.errors) {
      closeModal();
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <div className="expense-edit-modal">
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={30}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {!hasSettledMembers() && (
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Current: $${members?.reduce((sum, member) =>
                sum + parseFloat(member.amount_owed), 0).toFixed(2)}`}
            />
            {errors.amount && <p className="error">{errors.amount}</p>}
          </div>
        )}

        <div className="modal-buttons">
          <button className="edit-expense-save">Save Changes</button>
          <button className="edit-expense-cancel" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseEditModal;
