import React, { useState } from 'react'
import '../../styles/Navbar.css'
import ReorderIcon from '@material-ui/icons/Reorder'

function Navbar() {

  const [showLinks, setShowLinks] = useState(false)

  function openMobileMenuToggle() {
    setShowLinks(!showLinks)
  }

  return (
    <div className="navbarWrapper">
    <div className='Navbar'>
      <div className='leftSide'>
        <div className='logo'>logo</div>
      </div>
      <div className='rightSide'>
        <div className='links' id={showLinks ? 'hidden' : ''}>
          <a href='???'>Profile</a>
          <a href='???'>Games</a>
          <a href='???'>About</a>
          <img alt='' />
        </div>
        <button onClick={openMobileMenuToggle}>
          <ReorderIcon />
        </button>
      </div>
    </div>
    </div>

  )
}

export default Navbar
