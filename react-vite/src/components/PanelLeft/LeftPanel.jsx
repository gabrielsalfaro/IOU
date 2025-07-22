// import React from 'react'
import './LeftPanel.css'
import { NavLink } from 'react-router-dom';

const LeftPanel = () => {
  return (
    <>
      <div className="left-panel">
        <NavLink to='/dashboard' className='panel-link'>Dashboard</NavLink>
        <NavLink to='/expenses' className='panel-link'>All Expenses</NavLink>
        <NavLink to='/payments' className='panel-link'>Payment History</NavLink>
        <NavLink to='/friends' className='panel-link'>Friends</NavLink> {/*  temp, for my sanitiy */}
      </div>
      <div className="left-panel-friends">
        {/* display short friends list here when not in Friends page */}
      </div>

    </>
  )
}

export default LeftPanel