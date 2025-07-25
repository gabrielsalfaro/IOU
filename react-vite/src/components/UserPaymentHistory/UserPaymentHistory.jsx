import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserPaymentHistory, getExpenseById } from "../../redux/payments";

function UserPaymentHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userHistory } = useSelector(state => state.payments);
  const expenses = useSelector(state => state.expenses.expenses);
  const sessionUser = useSelector(state => state.session.user);

  // Fetch payments on load
  useEffect(() => {
    if (sessionUser && Object.keys(userHistory).length === 0) {
      dispatch(getUserPaymentHistory());
    }
  }, [dispatch, sessionUser, userHistory]);

  // Load missing expense details
  useEffect(() => {
    const payments = Object.values(userHistory);
    if (payments.length > 0) {
      const expenseIds = payments
        .map(p => p.expense_id)
        .filter(id => !expenses[id]);
      
      expenseIds.forEach(id => dispatch(getExpenseById(id)));
    }
  }, [dispatch, userHistory, expenses]);

  // Group payments by month/year
  const groupedPayments = Object.values(userHistory).reduce((acc, payment) => {
    const monthYear = new Date(payment.created_at).toLocaleString("default", { 
      month: "long", 
      year: "numeric" 
    });
    
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push({
      ...payment,
      expense: expenses[payment.expense_id] || { description: "Loading..." }
    });
    return acc;
  }, {});

  return (
    <div className="payment-history-container">
      <h2>Payment History</h2>

      {Object.entries(groupedPayments).map(([monthYear, payments]) => (
        <div key={monthYear}>
          <h3>{monthYear}</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.expense.description}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default UserPaymentHistory;