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
        <h2>Leave a Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment"
            required
          />
          {errors.content && <p>{errors.content}</p>}
          <button type="submit" disabled={loading}>Post Comment</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default CommentsAddModal;
