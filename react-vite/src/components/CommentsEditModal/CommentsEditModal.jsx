import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateComment } from "../../redux/comments";
import { getExpenseById } from "../../redux/expenses";
import './CommentsEditModal.css';

function CommentsEditModal({ commentId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // Grab comment from Redux store
  const comment = useSelector(state => {
    const allComments = state.expenses.currentExpense?.expense?.comments || [];
    return allComments.find(comment => comment.id === commentId);
  });

  const expenseId = useSelector(state => state.expenses.currentExpense?.expense?.id);

  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comment) setContent(comment.content);
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await updateComment(commentId, content);

    if (result) {
      await dispatch(getExpenseById(expenseId));
      closeModal();
    } else {
      setErrors({ general: "Failed to update comment." });
    }

    setLoading(false);
  };

  if (!comment) return <div>Loading comment...</div>;

  return (
    <div className="modal-container" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <h2>Edit Your Comment</h2>

        <form onSubmit={handleSubmit} className="edit-comment-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Update your comment"
          />
          {errors.general && <p className="error-message">{errors.general}</p>}

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CommentsEditModal;
