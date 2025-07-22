// import React from 'react'
import './Friends.css'

const Friends = () => {
  return (
    <div className="friends-container">
      <div className="friends-content">
        <div className="top-section">
          <div><h1>Friends</h1></div>
          <div className="friends-buttons">
            <button className="add-friend-button">Add a Friend</button>
            <button className="pending-friend-request-button">Pending Requests</button>
          </div>
        </div>
        <div className="all-friends-list">
          <ul>
            <li>Friend 1</li>
            <li>Friend 2</li>
            <li>Friend 3</li>
            <li>Friend 4</li>
            <li>Friend 5</li>
            <li>Friend 6</li>
          </ul>
        </div>
      </div>
    </div>
    
  )
}

export default Friends