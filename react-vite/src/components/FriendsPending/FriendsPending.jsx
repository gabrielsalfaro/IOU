import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchPendingFriends } from '../../redux/friends';
import { acceptFriend, declineFriend } from '../../redux/friends';
// import OpenModalButton from '../OpenModalButton';
// import FriendsAddRemoveModal from '../FriendsAddRemoveModal/FriendsAddRemoveModal'
import './FriendsPending.css';

const FriendsPending = () => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState('');

  const pendingObj = useSelector(state => state.friends?.pending || {});
  const pending = useMemo(() => Object.values(pendingObj), [pendingObj]);


  useEffect(() => {
    dispatch(fetchPendingFriends());
  }, [dispatch]);

  
  const handleAccept = async (friendId) => {
    const success = await dispatch(acceptFriend(friendId));
    if (success) {
      setSuccessMessage('Friend request ACCEPTED!');
    } else {
      console.error('Failed to accept friend request');
    }
  };

  const handleDecline = async (friendId) => {
    const success = await dispatch(declineFriend(friendId));
    if (success) {
      setSuccessMessage('Friend request DECLINED.');
    } else {
      console.error('Failed to decline friend request');
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <div className="friends-container">
      <div className="friends-content">
        <div className="top-section">
          <h1>Pending Friend Requests</h1>
        </div>

        {/* {successMessage && ( */}
          <div className="friend-status-message" key={successMessage}>
            <center>{successMessage}</center>
          </div>
        {/* )} */}

        {pending.length === 0 ? (
          <p className="friend-item">No pending requests.</p>
        ) : (

          <div className="all-friends-list">
            {pending.map(request => (
              <li key={request.id} className="friend-item">
                <div className="friend-info">
                  <NavLink to={`/users/${request.friend.id}`} >
                    {request.friend?.firstname} {request.friend?.lastname} (@{request.friend?.username})
                  </NavLink>
                </div>
                <div className="pending-friend-actions-container">
                  <div className="pending-friend-actions">
                    {/* <OpenModalButton
                      buttonText="Accept"
                      className="pending-friend-accept-btn"
                      modalComponent={<FriendsAddRemoveModal requestId={request.id} />} 
                    /> */}
                    <div>
                      <button onClick={() => handleAccept(request.friend.id)} className="pending-friend-accept-btn">
                        Accept
                      </button>
                    </div>
                    
                    {/* <OpenModalButton
                      buttonText="Decline"
                      className="pending-friend-decline-btn"
                      modalComponent={<FriendsAddRemoveModal requestId={request.id} />} 
                    /> */}
                    <div>
                      <button onClick={() => handleDecline(request.friend.id)} className="pending-friend-decline-btn">
                        Decline
                      </button>
                    </div>
                    

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
