import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfilePage.css'; // We'll create this CSS file

export default function UserProfilePage() {
  const { userId } = useParams();
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile-container">
      {/* Header Section */}
      <section className="profile-header">
        <h1>{user.firstname || 'John'} {user.lastname || 'Doe'}</h1>
        <p><strong>Username</strong></p>
        <p>{user.email || 'email@address'}</p>
        <p>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'July 4, 2025'}</p>
      </section>

      {/* Navigation Section */}
      <section className="profile-section">
        <h3>Examining</h3>
        <ul className="profile-nav-list">
          <li><strong>ExpenseApp</strong></li>
          <li>Dashboard</li>
          <li>All expenses</li>
          <li>Payment History</li>
        </ul>
      </section>

      {/* Friends Section */}
      <section className="profile-section">
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
        <button className="view-all-btn">View All Friends...</button>
      </section>
    </div>
  );
}