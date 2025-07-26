import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserPaymentHistory } from "../../redux/payments";

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
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>Payment History</h2>
      
      <div style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        paddingRight: '10px'
      }}>
        {Object.entries(grouped).map(([monthYear, items]) => (
          <div key={monthYear} style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.2rem',
              color: '#555',
              marginBottom: '10px',
              paddingLeft: '10px'
            }}>{monthYear}</h3>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              {items.map((payment) => (
                <div key={payment.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 20px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ flex: '1' }}>
                    <div style={{
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      {payment.expense?.description || "Expense"}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <span style={{
                      fontWeight: '600',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}>
                      ${payment.amount?.toFixed(2) || "0.00"}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      minWidth: '80px',
                      textAlign: 'center',
                      backgroundColor: payment.status === "paid" ? 'rgba(108, 219, 171, 0.2)' : 'rgba(242, 72, 34, 0.2)',
                      color: payment.status === "paid" ? '#6CDBAB' : '#F24822'
                    }}>
                      {payment.status === "paid" ? "Paid" : "Ongoing"}
                    </span>
                    <button 
                      style={{
                        color: '#3b82f6',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        padding: '5px 10px',
                        borderRadius: '4px'
                      }}
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
  );
}

export default UserPaymentHistory;