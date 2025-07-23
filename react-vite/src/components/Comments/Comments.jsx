import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getExpenseById } from '../../redux/expenses';
import './Comments.css';

const Comments = () => {
  const { expenseId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);


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
  if (!comments.length) return (
    <div className="comments-container">
      <div className="comments-top-section">
        <h3>Comments</h3>
        <button className="add-comment"></button>
        <div>No comments yet.</div>
      </div>
    </div>
  )

  const handleEdit = (commentId) => {
  console.log('Editing comment:', commentId);
  };

  const handleDelete = (commentId) => {
    console.log('Deleting comment:', commentId);
  };

      

  return (
    <div className="comments-container">
      <div className="comments-top-section">
        <h3>Comments</h3>
        <button className="add-comment"></button>
      </div>
      
      {comments.map(comment => {
        const isOwner = currentUser?.id === comment.user.id;

        return (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user.username}</strong>: {comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
            {isOwner && (
              <div className="comment-actions">
                <button onClick={() => handleEdit(comment.id)}>Edit</button>
                <button onClick={() => handleDelete(comment.id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
