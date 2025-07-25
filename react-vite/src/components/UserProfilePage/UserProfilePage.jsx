import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './UserProfilePage.css';

function UserProfile() {
  const user = useSelector(state => state.session.user);

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      
      {/* User Information Section */}
      <section className="profile-header">
        <h2>{user.username}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-join-date">
          Member since, {new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </section>

      <hr className="divider" />

      {/* Examining Section */}
      <section className="examining-section">
        <h3>Examining</h3>
        <ul className="examining-list">
          <li><strong>ExpenseApp</strong></li>
          <li>Dashboard</li>
          <li>All expenses</li>
          <li>Payment History</li>
        </ul>
      </section>

      <hr className="divider" />

      {/* Friends Section */}
      <section className="friends-section">
        <h3>FRIENDS</h3>
        <ul className="friends-list">
          <li>
            <input type="checkbox" id="friend1" className="friend-checkbox" />
            <label htmlFor="friend1" className="friend-label">friend_1</label>
          </li>
          <li>
            <input type="checkbox" id="friend2" className="friend-checkbox" checked readOnly />
            <label htmlFor="friend2" className="friend-label">friend_2</label>
          </li>
          <li>
            <input type="checkbox" id="friend3" className="friend-checkbox" />
            <label htmlFor="friend3" className="friend-label">friend_3</label>
          </li>
        </ul>
        <Link to="/friends" className="view-all-link">View All Friends...</Link>
      </section>

      <hr className="divider" />

      {/* Useful Section */}
      <section className="useful-section">
        <h3>Useful</h3>
        <ul className="useful-list">
          <li>
            <input type="checkbox" id="user" className="useful-checkbox" />
            <label htmlFor="user" className="useful-label">User</label>
          </li>
          <li>
            <input type="checkbox" id="addFriend" className="useful-checkbox" />
            <label htmlFor="addFriend" className="useful-label">Add Friend</label>
          </li>
          <li>
            <input type="checkbox" id="searchExpenses" className="useful-checkbox" />
            <label htmlFor="searchExpenses" className="useful-label">Search Expenses</label>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default UserProfile;