import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getExpenseById } from '../../redux/expenses';
import './Comments.css';

const Comments = () => {
  const { expenseId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExpenseById(expenseId));
  }, [dispatch, expenseId]);

  // Grab state
  const currentExpense = useSelector(state => state.expenses.currentExpense);

  // Memoize 
  const comments = useMemo(() => {
    return currentExpense?.expense?.comments ?? [];
  }, [currentExpense?.expense?.comments]);

  const loading = useSelector(state => state.expenses.loading);

  if (loading) return <div>Loading comments...</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  return (
    <div className="comments-container">
      <h3>Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p><strong>{comment.user.username}</strong>: {comment.content}</p>
          <small>{new Date(comment.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Comments;
