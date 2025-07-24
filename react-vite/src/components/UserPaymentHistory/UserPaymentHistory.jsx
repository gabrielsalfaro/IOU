import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPaymentsForUser } from "../../store/payments"; // You'll build this
import { useNavigate } from "react-router-dom";

function UserPaymentHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payments = useSelector((state) => Object.values(state.payments.userPayments || {}));
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser) dispatch(getAllPaymentsForUser());
  }, [dispatch, sessionUser]);

  // Group payments by month/year
  const grouped = payments.reduce((acc, payment) => {
    const date = new Date(payment.created_at);
    const key = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(payment);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      {Object.entries(grouped).map(([monthYear, items]) => (
        <div key={monthYear} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{monthYear}</h3>
          <div className="bg-white shadow-md rounded overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Expense Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((payment) => (
                  <tr key={payment.id} className="border-t">
                    <td className="p-2">{payment.expense?.name || "Expense name"}</td>
                    <td className="p-2">{payment.expense?.description || "No description"}</td>
                    <td className="p-2">${payment.amount?.toFixed(2) || "0.00"}</td>
                    <td className="p-2">
                      {payment.status === "Paid" ? "Settled" : "Ongoing"}
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={() => navigate(`/expenses/${payment.expense_id}`)}
                      >
                        Review
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
