import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const [user, setUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleAddFriend = () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.firstname?.[0]}
          {user.lastname?.[0]}
        </div>

        <div className="profile-info">
          <h2>
            {user.firstname} {user.lastname}
          </h2>
          <div className="info-box">
            <p>
              <span>Username:</span> {user.username}
            </p>
            <p>
              <span>Email:</span> {user.email}
            </p>
            <p>
              <span>Member since:</span> {formatMemberSince(user.created_at)}
            </p>
          </div>
        </div>

        {sessionUser?.id !== user.id && (
          <button className="add-friend-btn" onClick={handleAddFriend}>
            Add Friend
          </button>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-dropdown">
          <p>Friend request sent to {user.firstname}!</p>
          <button className="close-btn" onClick={() => setShowConfirmation(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
