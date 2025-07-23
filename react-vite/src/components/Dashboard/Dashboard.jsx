import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser) {
    return <Navigate to="/" replace={true} />; //dont bring back user to dashboard if not logged in, use replace to prevent going back to unauthorized page
  }

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <button>Add an Expense</button>
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
