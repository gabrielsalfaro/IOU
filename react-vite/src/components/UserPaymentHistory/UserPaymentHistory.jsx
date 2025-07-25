import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPaymentHistory } from "../../store/payments";
import { getExpenseById } from "../../store/expenses";
import { useNavigate } from "react-router-dom";

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
      expense: expenses[payment.expense_id] || { description: "Expense details loading..." }
    });
    return acc;
  }, {});

  return (
    <div className="payment-history-container p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      {Object.entries(groupedPayments).map(([monthYear, payments]) => (
        <div key={monthYear} className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-gray-700">{monthYear}</h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{payment.expense.description}</td>
                    <td className="p-3 text-right">${payment.amount.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`status-pill ${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate(`/expenses/${payment.expense_id}`)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPaymentHistory;