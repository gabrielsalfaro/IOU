import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import { getExpenses } from '../../redux/expenses';
import ExpenseMembersModal from '../ExpenseMembersModal/ExpenseMembersModal';
import './Dashboard.css';

function Dashboard() {
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const expenses = useSelector(state => Object.values(state.expenses.expenses));

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const openExpenseModal = () => {
    setModalContent(<ExpenseMembersModal />);
  };

  if (!sessionUser) {
    return <Navigate to="/" replace={true} />; //dont bring back user to dashboard if not logged in, use replace to prevent going back to unauthorized page
  }

  const calculateTotals = () => {
    let owed = 0;
    let owe = 0;

    expenses.forEach(expense => {
      expense?.expense_members?.forEach(member => {
        if (member?.user_id === sessionUser?.id) {
          if (!member?.settled) {
            owe += parseFloat(member?.amount_owed);
          }
        } else if (expense?.expense_owner === sessionUser?.id && !member?.settled) { 
          owed += parseFloat(member?.amount_owed);
        }
      });
    });

    return {
      totalBalance: owed - owe,
      youOwe: owe,
      youAreOwed: owed
    };
  };

  const { totalBalance, youOwe, youAreOwed } = calculateTotals();


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="dashboard-add-expense" onClick={openExpenseModal}>
          Add an Expense
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-title">Total Balance</div>
          <div className={`summary-amount ${totalBalance > 0 ? 'amount-positive' : totalBalance < 0 ? 'amount-negative' : 'amount-zero'}`}>
            ${totalBalance}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">You Owe</div>
          <div className="summary-amount amount-negative">
            ${youOwe}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">You Are Owed</div>
          <div className="summary-amount amount-positive">
            ${youAreOwed}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
