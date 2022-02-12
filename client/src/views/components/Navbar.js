import React, { useState } from 'react'
import '../../styles/Navbar.css'
import ReorderIcon from '@material-ui/icons/Reorder';
import LogoutButton from '../components/auth buttons/LogoutButton';
import logo from '../../styles/logoImg/logo.png'

function Navbar() {

  const [showLinks, setShowLinks] = useState(false)

  function openMobileMenuToggle() {
    setShowLinks(!showLinks)
  }
  return (
    <div>
      <div className="navbarWrapper">
        <div className='Navbar'>

          <img className='logoImg' src={logo} alt='Logo' />

          <div className='rightSide'>
            <div className='links' id={showLinks ? 'hidden' : ''}>

              <img alt='' />
              <LogoutButton />

            </div>

            <button onClick={openMobileMenuToggle}>
              <ReorderIcon />
            </button>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Navbar
