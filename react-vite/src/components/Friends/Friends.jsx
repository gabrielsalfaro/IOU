import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchFriends, fetchPendingFriends } from '../../redux/friends';
import './Friends.css'

const Friends = () => {
  const dispatch = useDispatch();

  const friendsObj = useSelector(state => state.friends?.friends || {});
  
  // Memoize the transformation to prevent unnecessary re-renders
  const friends = useMemo(() => Object.values(friendsObj), [friendsObj]);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchPendingFriends());
  }, [dispatch]);

  return (
    <div className="friends-container">
      <div className="friends-content">
        <div className="top-section">
          <div>
            <h1>Friends</h1>
          </div>
          <div className="friends-buttons">
            <button className="add-friend-button">Add a Friend</button>
            <NavLink to='/friends/pending'>
              <button className="pending-friend-request-button">Pending Requests</button>
            </NavLink>
          </div>
        </div>
        <div className="all-friends-list">
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            <ul>
              {friends.map(friend => (
                <li key={friend.id}>
                  {/* <img src={friend.friend.profile_img} alt={friend.friend.username} /> */}
                  {friend.friend.firstname} {' '}
                  {friend.friend.lastname}
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