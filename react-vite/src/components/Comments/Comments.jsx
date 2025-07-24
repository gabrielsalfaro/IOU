import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getExpenseById } from '../../redux/expenses';
import { deleteComment } from '../../redux/comments';
import OpenModalButton from '../OpenModalButton';
import CommentsEditModal from '../CommentsEditModal/CommentsEditModal';
import './Comments.css';

const Comments = () => {
  const { expenseId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);

  // const hasReviewed = reviews.some(review => review?.userId === sessionUser?.id);

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
        <button className="add-comment">Add Comment</button>
        {/* {sessionUser && sessionUser.id !== hostId && !hasReviewed && (
          <OpenModalButton
            buttonText="Post Your Review"
            className="review-create-review"
            modalComponent={<CreateNewReview spotId={spotId} />}
          />
        )} */}
        
      </div>
      <div>No comments yet.</div>
    </div>
  )

  // const handleEdit = (commentId) => {
  //   console.log('Editing comment:', commentId);
  //   console.log(typeof updateComment)
  // };

  const handleDelete = async (commentId) => {
    const success = await dispatch(deleteComment(commentId));
    if (success) {
      console.log('Deleted comment');
      dispatch(getExpenseById(expenseId));
    }
  };


      

  return (
    <div className="comments-container">
      <div className="comments-top-section">
        <h3>Comments</h3>
        {/* <button className="add-comment"></button> */}
      </div>
      
      {comments.map(comment => {
        const isOwner = currentUser?.id === comment.user.id;

        return (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user.username}</strong>: {comment.content}</p>
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
