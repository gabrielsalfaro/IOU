import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

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

  if (!user) return <div className="loading">Loading...</div>;

  return (
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
  );
}