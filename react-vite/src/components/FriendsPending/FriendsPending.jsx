import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingFriends } from '../../redux/friends';
// import OpenModalButton from '../OpenModalButton';
// import FriendsAddRemoveModal from '../FriendsAddRemoveModal/FriendsAddRemoveModal'
import './FriendsPending.css';

const FriendsPending = () => {
  const dispatch = useDispatch();

  const pendingObj = useSelector(state => state.friends?.pending || {});
  const pending = useMemo(() => Object.values(pendingObj), [pendingObj]);


  useEffect(() => {
    dispatch(fetchPendingFriends());
  }, [dispatch]);

  
  const handleAccept = async (friendId) => {
    const res = await fetch(`/api/friends/accept/${friendId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      dispatch(fetchPendingFriends());
    } else {
      console.error('Failed to accept friend request');
    }
  };

  const handleDecline = async (friendId) => {
    const res = await fetch(`/api/friends/decline/${friendId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      dispatch(fetchPendingFriends());
    } else {
      console.error('Failed to decline friend request');
    }
  };

  return (
    <div className="friends-container">
      <div className="friends-content">
        <div className="top-section">
          <h1>Pending Friend Requests</h1>
        </div>

        {pending.length === 0 ? (
          <p className="friend-item">No pending requests.</p>
        ) : (

          <div className="all-friends-list">
            {pending.map(request => (
              <li key={request.id} className="friend-item">
                <div className="friend-info">
                  {request.friend?.firstname} {request.friend?.lastname} (@{request.friend?.username})
                </div>
                <div className="friend-actions">
                  <div className="friend-actions">
                    {/* <OpenModalButton
                      buttonText="Accept"
                      className="friend-accept-btn"
                      modalComponent={<FriendsAddRemoveModal requestId={request.id} />} 
                    /> */}
                    <button onClick={() => handleAccept(request.friend.id)} className="friend-accept-btn">
                      Accept
                    </button>
                    <button onClick={() => handleDecline(request.friend.id)} className="friend-decline-btn">
                      Decline
                    </button>

                  </div>

                </div>
              </li>
            ))}
          </div>

        )}
        
      </div>
    </div>
  );
};

export default FriendsPending;
