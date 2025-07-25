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
    <div className="comments-delete-container" onClick={closeModal}>
      <div className="comments-delete-content" onClick={(e) => e.stopPropagation()}>
        <h1>Confirm Delete</h1>
        <label>Are you sure you want to remove your comment?</label>
        <button className="comments-delete-button" onClick={handleDelete}>Confirm</button>
        <button className="comments-cancel-button" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default CommentsDeleteModal;
