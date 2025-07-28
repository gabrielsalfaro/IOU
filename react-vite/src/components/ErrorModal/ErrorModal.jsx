import { useModal } from "../../context/Modal";
import './ErrorModal.css';

function ErrorModal({ message }) {
  const { closeModal } = useModal();

  return (
    <div className="error-modal-content">
        <h2 className="error-title">Error</h2>
        <p className="error-message">{message}</p>
        <button className="error-close-button" onClick={closeModal}>OK</button>
    </div>
  )
}

export default ErrorModal;
