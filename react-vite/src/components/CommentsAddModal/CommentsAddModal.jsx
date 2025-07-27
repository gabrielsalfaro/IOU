import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { addComment } from "../../redux/comments";
import { getExpenseById } from "../../redux/expenses";
import './CommentsAddModal.css';

const CommentsAddModal = ({ expenseId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await dispatch(addComment(expenseId, content));

    if (!result.errors) {
      await dispatch(getExpenseById(expenseId));
      closeModal();
    } else {
      setErrors(result.errors);
    }

    setLoading(false);
  };

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Leave a Comment</h1>
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment"
            required
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
          <div className="comment-button-group">
            <button type="submit" 
              className="new-comment-add-button" 
              disabled={loading}><center>Post Comment</center>
            </button>
            <button type="button" 
              className="new-comment-cancel-button" 
              onClick={closeModal}><center>Cancel</center>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentsAddModal;
