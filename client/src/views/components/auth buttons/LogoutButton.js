import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import './LogoutButton.css'

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <a className='logout-button' onClick={() => logout()}>
    Log out
    </a>
  )
}

export default LogoutButton