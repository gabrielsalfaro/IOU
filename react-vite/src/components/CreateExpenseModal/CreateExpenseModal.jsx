import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createExpense } from "../../redux/expenses";
import { getExpenses } from "../../redux/expenses";
import { useNavigate } from 'react-router-dom';
import './CreateExpenseModal.css'

function ExpenseDetailModal({ selectedFriends }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      description,
      amount: parseFloat(amount),
      expense_members: selectedFriends
    };

    const response = await dispatch(createExpense(expenseData));

    if(response.errors) {
      setErrors(response.errors);
    } else {
      await dispatch(getExpenses());
      closeModal();
      navigate(`/expenses/${response.data.expense.id}`);
    }
  }

  return (
    <div className="expense-detail-modal">
      <h2>Enter Expense Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="create-expense-description-container">
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter expense description"
              className="expense-description-input"
            />
          </label>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="create-expense-amount-container">
          <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="expense-amount-input"
            />
          </label>
          {errors.amount && <p className="error">{errors.amount}</p>}
        </div>

        <div className="selected-friends-preview">
          <p>Splitting with {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}</p>
          <p className="amount-per-person">
            {amount ? `$${((amount) / (selectedFriends.length + 1)).toFixed(2)} per person` : ''}
          </p>
        </div>

        <div className="expense-creation-button-container">
          <button type="submit" className="create-expense-button">
            Create Expense
          </button>
          <button type="button" onClick={closeModal} className="create-expense-cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseDetailModal;
