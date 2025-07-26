import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserPaymentHistory } from "../../redux/payments";
import "./UserPaymentHistory.css";

function UserPaymentHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payments = useSelector((state) => Object.values(state.payments.userHistory || {}));
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser) dispatch(getUserPaymentHistory());
  }, [dispatch, sessionUser]);

  const grouped = payments.reduce((acc, payment) => {
    let date;
    try {
      date = payment.created_at ? new Date(payment.created_at) : new Date();
      if (isNaN(date.getTime())) date = new Date();
    } catch {
      date = new Date();
    }
    
    const key = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(payment);
    return acc;
  }, {});

  return (
    <div className="payment-page-container">
      <div className="payment-history-wrapper">
        <div className="payment-history-container">
          <div className="payment-history-header">
            <h2 className="payment-history-title">Payment History</h2>
          </div>
          
          <div className="payment-history-scroll-container">
            {Object.entries(grouped).map(([monthYear, items]) => (
              <div key={monthYear} className="payment-month-group">
                <h3 className="payment-month-title">{monthYear}</h3>
                <div className="payments-box">
                  {items.map((payment) => (
                    <div key={payment.id} className="payment-item">
                      <div className="payment-description-container">
                        <div className="payment-description">
                          {payment.expense_description || "expense"}
                        </div>
                      </div>
                      <div className="payment-details">
                        <span className="payment-amount">
                          ${payment.amount?.toFixed(2) || "0.00"}
                        </span>
                        <span className={`payment-status ${payment.status}`}>
                          {payment.status === "paid" ? "Paid" : "Ongoing"}
                        </span>
                        <button 
                          className="payment-review-btn"
                          onClick={() => navigate(`/expenses/${payment.expense_id}`)}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPaymentHistory;