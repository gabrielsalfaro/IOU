import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchPendingFriends } from '../../redux/friends';
import { acceptFriend, declineFriend } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton';
// import OpenModalButton from '../OpenModalButton';
import FriendsAddRemoveModal from '../FriendsAddRemoveModal/FriendsAddRemoveModal'
import './FriendsPending.css';

const FriendsPending = () => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState('');
  const [messageType, setMessageType] = useState(""); // 'accepted' or 'declined' for colors
  // const [acceptedFriendId, setAcceptedFriendId] = useState(null);
  const [acceptedFriend, setAcceptedFriend] = useState(null);
  const [declinedFriend, setDeclinedFriend] = useState(null);
  const [inviteSentFriend, setInviteSentFriend] = useState(null);


  const pendingObj = useSelector(state => state.friends?.pending || {});
  const pending = useMemo(() => Object.values(pendingObj), [pendingObj]);


  useEffect(() => {
    dispatch(fetchPendingFriends());
  }, [dispatch]);

  const handleInviteSent = (friend) => {
    setInviteSentFriend(friend);
    setTimeout(() => setInviteSentFriend(null), 3000);
  };

  
  const handleAccept = async (friend) => {
    setAcceptedFriend(friend); 
    setMessageType('accepted');

    const success = await dispatch(acceptFriend(friend.id));
    if (success) {
      setTimeout(() => {
        setAcceptedFriend(null);
      }, 3000);
    } else {
      console.error('Failed to accept friend request');
    }
  };

  const handleDecline = async (friend) => {
    setDeclinedFriend(friend); 
    setMessageType('declined');

    const success = await dispatch(declineFriend(friend.id));
    if (success) {
      setTimeout(() => {
        setDeclinedFriend(null);
      }, 3000);
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
        <div className="friends-top-section">
          <h1>Pending Friend Requests</h1>
           <div className="spacer"></div>

          {inviteSentFriend && (
            <div className="pending-friends-confirmation-dropdown fixed-toast">
              <center>
                <p>
                  <b>Friend request sent to {inviteSentFriend.firstname}!</b>
                </p>
              </center>
            </div>
          )}
          <div className="friends-buttons">
            <OpenModalButton
              buttonText="Add a Friend"
              className="add-friend-button"
              modalComponent={<FriendsAddRemoveModal onInviteSent={handleInviteSent} />} 
            />
            {/* <button className="add-friend-button">Add a Friend</button> */}
            {/* <NavLink to='/friends/pending'>
              <button className="pending-friend-request-button">Pending Requests</button>
            </NavLink> */}
          </div>

        </div>

       

        {/* {successMessage && ( */}
          <div className={`friend-status-message ${messageType}`} key={successMessage}>
            <center>{successMessage}</center>
          </div>
        {/* )} */}

        {acceptedFriend && (
          <div className="pending-friends-confirmation-dropdown fixed-toast">
            <center>
              <p>
                <center>
                  <b>{acceptedFriend.firstname} is now your friend!</b>
                </center>
              </p>
            </center>
            <div className="pending-friend-dropdown-close-btn-container">
              {/* <button 
                className="pending-friend-dropdown-close-btn" 
                onClick={() => setAcceptedFriend(null)}
              >x
              </button> */}
            </div>
          </div>
        )}
        {declinedFriend && (
          <div className="pending-friends-confirmation-dropdown fixed-toast declined">
            <center>
              <p>
                <b>{declinedFriend.firstname} {'won\'t be your friend. How sad!'}</b>
              </p>
            </center>
            <div className="pending-friend-dropdown-close-btn-container">
              {/* <button 
                className="pending-friend-dropdown-close-btn" 
                onClick={() => setDeclinedFriend(null)}
              >
                x
              </button> */}
            </div>
          </div>
        )}

        {pending.length === 0 ? (
          <p className="friend-item">No pending requests.</p>
        ) : (

          <div className="all-friends-list-container">
          <center>
          <div className="all-friends-list">
            
            {pending.map(request => (
              <li key={request.id} className="friend-item">
                <div className="friend-info">
                  <div className="main-friend-img">
                        <img src={request.friend.profile_img} alt="" />
                  </div>
                  <NavLink to={`/users/${request.friend.id}`} >
                    <b>{request.friend?.firstname} {request.friend?.lastname} (@{request.friend?.username})</b>
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
                      
                      <button 
                        onClick={() => handleAccept(request.friend)} 
                        className="pending-friend-accept-btn"
                      >
                        Accept
                      </button>

      
                    </div>
                    
                    {/* <OpenModalButton
                      buttonText="Decline"
                      className="pending-friend-decline-btn"
                      modalComponent={<FriendsAddRemoveModal requestId={request.id} />} 
                    /> */}
                    <div>
                      
                      <button 
                        onClick={() => handleDecline(request.friend)} 
                        className="pending-friend-decline-btn"
                      >
                        Decline
                      </button>
                    </div>
                    

                  </div>

                </div>
              </li>
            ))}
          </div>
                  </center>
        </div>

        )}

      </div>
    </div>
  );
};

export default FriendsPending;
