import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteComment } from "../../redux/comments";
import { getExpenseById } from "../../redux/expenses";
import './CommentsDeleteModal.css';

const CommentsDeleteModal = ({ commentId, expenseId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal(); 

  const handleDelete = async () => {
    const success = await dispatch(deleteComment(commentId));
    if (success) {
      await dispatch(getExpenseById(expenseId));
      closeModal();
    }
  };

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Confirm Delete</h1>
        <p className="modal-description">Are you sure you want to remove your comment?</p>

        <div className="comment-button-group">
          <button 
            className="new-comment-cancel-button" 
            onClick={handleDelete}
          >
            <center>Yes, Delete</center>
          </button>
          <button 
            className="new-comment-add-button" 
            onClick={closeModal}
          >
            <center>Cancel</center>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsDeleteModal;
