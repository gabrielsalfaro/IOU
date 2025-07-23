import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import ExpenseMembersModal from '../ExpenseMembersModal/ExpenseMembersModal';

function Dashboard() {
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent } = useModal();

  const openExpenseModal = () => {
    setModalContent(<ExpenseMembersModal />);
  };

  if (!sessionUser) {
    return <Navigate to="/" replace={true} />; //dont bring back user to dashboard if not logged in, use replace to prevent going back to unauthorized page
  }

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <button onClick={openExpenseModal}>Add an Expense</button>
      </div>

      <div className='dashboard-summary'>
        <div>Total Balance</div>
        <div>You Owe</div>
        <div>You Are Owed</div>
      </div>
    </>
  );
}

export default Dashboard;
