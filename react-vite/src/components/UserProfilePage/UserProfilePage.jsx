import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([
    { id: 1, name: 'friend_1', selected: false },
    { id: 2, name: 'friend_2', selected: true },
    { id: 3, name: 'friend_3', selected: false }
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, [userId]);

  const toggleFriend = (id) => {
    setFriends(friends.map(friend => 
      friend.id === id ? {...friend, selected: !friend.selected} : friend
    ));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page-container">
      <header className="app-header">
        <h1>ExpenseApp</h1>
      </header>

      <div className="profile-content-container">
        <div className="left-navigation">
          <ul className="nav-menu">
            <li onClick={() => handleNavigation('/dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigation('/expenses')}>All expenses</li>
            <li onClick={() => handleNavigation('/payments')}>Payment History</li>
          </ul>
       
          <div className="friends-section-nav">
            <h3>FRIENDS</h3>
            <div className="friends-list">
              {friends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <input
                    type="checkbox"
                    id={`friend-${friend.id}`}
                    checked={friend.selected}
                    onChange={() => toggleFriend(friend.id)}
                  />
                  <label htmlFor={`friend-${friend.id}`}>{friend.name}</label>
                </div>
              ))}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => handleNavigation('/friends')}
            >
              View All Friends...
            </button>
          </div>
        </div>
        <div className="divider-vertical"></div>

        <div className="main-content">
          <div className="profile-header">
            <h2>User Profile</h2>
            <div className="header-actions">
              <button className="add-friend-btn">Add Friend</button>
              <div className="divider-vertical-small"></div>
              <div className="search-container">
                <input type="text" placeholder="Search expenses" />
              </div>
            </div>
          </div>

          <div className="user-info">
            <h3>{user.firstname || 'John'} {user.lastname || 'Doe'}</h3>
            <p><strong>Username:</strong> {user.username || 'demo'}</p>
            <p><strong>Email:</strong> {user.email || 'demo@aa.io'}</p>
            <p>Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }) : 'July 4, 2025'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}