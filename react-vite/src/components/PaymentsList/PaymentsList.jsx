import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsForExpense, togglePaymentStatus } from "../../store/payments";
// import PaymentsList from "./PaymentsList";

function PaymentsList({ expenseId }) {
    const dispatch = useDispatch();

    const payments = useSelector((state) => Object.values(state.payments.payments)); 
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        if (expenseId) dispatch(getPaymentsForExpense(expenseId));
    }, [dispatch, expenseId]);

  const handleToggle = async (paymentId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    await dispatch(togglePaymentStatus(paymentId, newStatus));
  };

   return (
    <div className="payments-list space-y-2">
      <h3 className="text-lg font-semibold">Payment Status</h3>
      {payments.length === 0 ? (
        <p>No are payments are currently found.</p>
      ) : (
        payments.map((payment) => (
          <div
            key={payment.id}
            className="flex justify-between items-center border p-2 rounded shadow-sm"
          >
            <span>{payment.user?.username || "User"}</span>
            <span
              className={`px-3 py-1 rounded-full text-white ${
                payment.status === "Paid" ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {payment.status}
            </span>

            {/* Show toggle button only if session user is the same as the payment user */}
            {sessionUser?.id === payment.user_id && (
              <button
                onClick={() => handleToggle(payment.id, payment.status)}
                className="ml-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Mark as {payment.status === "Paid" ? "Unpaid" : "Paid"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PaymentsList;