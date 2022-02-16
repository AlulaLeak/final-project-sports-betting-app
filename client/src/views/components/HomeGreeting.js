import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import '../../styles/HomeGreeting.css'

function HomeGreeting() {
    const { user } = useAuth0();
    return (
        <div className="topbox">
            <div className="greeting">
                <h1 className="hello">Hello,</h1>
                <h1 className="hello">{user.name}</h1>
            </div>
            <div className="words">
                <img className="avatar" src={user.picture} alt={("picture of: ", user.name)} />
            </div>
            
        </div>
    )
}

export default HomeGreeting
