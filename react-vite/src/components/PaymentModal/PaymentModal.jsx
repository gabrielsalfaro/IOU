import { useState } from "react";
import './PaymentModal.css';

function PaymentModal({ expenseId, onClose, onSubmit, showComingSoon }) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal-content payment-modal-content" onClick={(e) => e.stopPropagation()}>
        {!showComingSoon ? (
          <>
            <h1 className="modal-title">Pay for Expense #{expenseId}</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }} className="payment-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={cardDetails.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                />
              </div>
              
              <div className="payment-modal-actions">
                <button 
                  type="button" 
                  className="cancel-payment-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-payment-btn"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="modal-title">Payment Processing</h1>
            <div className="coming-soon-message">
              <p>This feature is coming soon!</p>
              <p>We&apos;re working hard to implement secure payment processing.</p>
            </div>
            <div className="payment-modal-actions">
              <button 
                className="close-coming-soon-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;