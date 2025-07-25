import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { getExpenseById } from '../../redux/expenses';
// import { deleteComment } from '../../redux/comments';
import OpenModalButton from '../OpenModalButton';
import CommentsEditModal from '../CommentsEditModal/CommentsEditModal';
import './Comments.css';
import CommentsDeleteModal from '../CommentsDeleteModal/CommentsDeleteModal';
import CommentsAddModal from '../CommentsAddModal/CommentsAddModal';

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


  // move to bottom section? 
  if (!comments.length) return (
    <div className="comments-container">
      <div className="comments-top-section">
        <h3>Comments</h3>
        {/* <button className="add-comment">Add Comment</button> */}
        <OpenModalButton
          buttonText="Add Comment"
          className="add-comment-button"
          modalComponent={(closeModal) => (
            <CommentsAddModal expenseId={expenseId} closeModal={closeModal} />
          )}
        />


      </div>
      <div>No comments yet.</div>
    </div>
  )



  return (
    // {comments.length === 0 ? (
    //   // render this
    // ) : (
    //   // else render this
    // )}
    <div className="comments-container">
      <div className="comments-top-section">
        <h3>Comments</h3>
        {/* <button className="add-comment"></button> */}
      </div>

      {comments.map(comment => {
        const isOwner = currentUser?.id === comment.user.id;

        return (
          <div key={comment.id} className="comment">
            <p>
               <NavLink to={`/users/${comment.user.id}`} >
              <strong>{comment.user.username}</strong>
              </NavLink>
              : {comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
            {isOwner && (
              <div className="comment-actions">
                <OpenModalButton
                  buttonText="Edit"
                  className="edit-comment-button"
                  modalComponent={(closeModal) => (
                    <CommentsEditModal commentId={comment.id} closeModal={closeModal} />
                  )}
                />
                {/* <button onClick={() => handleEdit(comment.id)}>Edit</button> */}
                <OpenModalButton
                  buttonText="Delete"
                  className="delete-comment-button"
                  modalComponent={
                    <CommentsDeleteModal commentId={comment.id} expenseId={expenseId} />
                  }
                />

                {/* <button onClick={() => handleDelete(comment.id)}>Delete</button> */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
