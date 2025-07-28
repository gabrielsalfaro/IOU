import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchFriends, fetchPendingFriends } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton';
import FriendsAddRemoveModal from '../FriendsAddRemoveModal/FriendsAddRemoveModal'
import './Friends.css'

const Friends = () => {
  const dispatch = useDispatch();
  // const [successMessage, setSuccessMessage] = useState('');
  const [inviteSentFriend, setInviteSentFriend] = useState(null);
  const [friendRemoved, setFriendRemoved] = useState(null);


  const friendsObj = useSelector(state => state.friends?.friends || {});
  
  // Memoize and sort
  const friends = useMemo(() => Object.values(friendsObj).sort((a, b) => {
    const nameA = a.friend.firstname.toLowerCase();
    const nameB = b.friend.firstname.toLowerCase();
    return nameA.localeCompare(nameB);
  }), [friendsObj]);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchPendingFriends());
  }, [dispatch]);

  // useEffect(() => {
  //   if (successMessage) {
  //     const timeout = setTimeout(() => setSuccessMessage(''), 3000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [successMessage]);

  const handleInviteSent = (friend) => {
    setInviteSentFriend(friend);
    setTimeout(() => setInviteSentFriend(null), 3000);
  };
  
  const handleRemoveFriend = (friend) => {
    setFriendRemoved(friend);
    setTimeout(() => setFriendRemoved(null), 3000);
  };




  return (
    <div className="friends-container">
      <div className="friends-content">

        <div className="friends-top-section">
          <div>
            <h1>Friends</h1>
          </div>

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
          
          {friendRemoved && (
            <div className="pending-friends-confirmation-dropdown fixed-toast">
              <center>
                <p style={{color: '#F24822'}}>
                  {/* {console.log(friendRemoved.firstname)} */}
                  <b>{friendRemoved.firstname} is no longer your friend. How sad!</b>
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

            <NavLink to='/friends/pending'>
              <button className="pending-friend-request-button">Pending Requests</button>
            </NavLink>
          </div>
        </div>

        <div className="friend-status-message" 
        // key={successMessage}
        >
            {/* <center>{successMessage}</center> */}
        </div>
        
        <div className="all-friends-list-container">
          <center>
        <div className="all-friends-list">
          {friends.length === 0 ? (
            <p className="friend-item">No friends yet.</p>
          ) : (
            <ul>
              {friends.map(friend => (
                <li key={friend.id} className="friend-item">

                  <div className="friend-content">
                    <div className="friend-info">

                      <div className="main-friend-img">
                        <img src={friend.friend.profile_img} alt="" />
                      </div>
                      <NavLink to={`/users/${friend.friend.id}`} >
                        <b>{friend.friend.firstname} {friend.friend.lastname} (@{friend.friend?.username})</b>
                      </NavLink>
                    </div>

                    <div className="friend-actions">
                      {/* <button onClick={() => handleDelete(friend.friend.id)} className='friend-remove-button'>Remove</button> */}
                      <OpenModalButton
                        buttonText="Remove"
                        className="friend-remove-button"
                        modalComponent={<FriendsAddRemoveModal actionType="remove" friend={friend.friend} onFriendRemove={handleRemoveFriend} />}
                      />

                    </div>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
        </center>
        </div>
      </div>
    </div>
    
  )
}

export default Friends