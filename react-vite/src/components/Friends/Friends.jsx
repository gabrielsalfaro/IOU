import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchFriends, fetchPendingFriends } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton';
import FriendsAddRemoveModal from '../FriendsAddRemoveModal/FriendsAddRemoveModal'
import './Friends.css'

const Friends = () => {
  const dispatch = useDispatch();

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

  // const handleDelete = async (friendId) => {
  //   const res = await fetch(`/api/friends/decline/${friendId}`, {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' }
  //   });

  //   if (res.ok) {
  //     dispatch(fetchPendingFriends());
  //   } else {
  //     console.error('Failed to decline friend request');
  //   }
  // };

  //   const handleDelete = (commentId) => {
  //   console.log('Removing friend:', commentId);
  // };

  return (
    <div className="friends-container">
      <div className="friends-content">

        <div className="friends-top-section">
          <div>
            <h1>Friends</h1>
          </div>

          <div className="spacer"></div>

          <div className="friends-buttons">
            <OpenModalButton
              buttonText="Add a Friend"
              className="friend-accept-btn"
              modalComponent={<FriendsAddRemoveModal />} 
            />
            {/* <button className="add-friend-button">Add a Friend</button> */}
            <NavLink to='/friends/pending'>
              <button className="pending-friend-request-button">Pending Requests</button>
            </NavLink>
          </div>
        </div>

        <div className="all-friends-list">
          {friends.length === 0 ? (
            <p className="friend-item">No friends yet.</p>
          ) : (
            <ul>
              {friends.map(friend => (
                <li key={friend.id} className="friend-item">

                  <div className="friend-content">
                    <div className="friend-info">
                      {friend.friend.firstname} {friend.friend.lastname}
                    </div>

                    <div className="friend-actions">
                      {/* <button onClick={() => handleDelete(friend.friend.id)} className='friend-remove-button'>Remove</button> */}
                      <OpenModalButton
                        buttonText="Remove"
                        className="friend-remove-button"
                        modalComponent={<FriendsAddRemoveModal actionType="remove" friend={friend.friend} />}
                      />

                    </div>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default Friends