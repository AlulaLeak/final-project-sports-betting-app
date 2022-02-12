import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import '../../styles/HomeGreeting.css'

function HomeGreeting() {
    const { user } = useAuth0();
    return (
        <div className="topbox">
            <div className="words">
                <h1 className="hello">Hello, {user.name}</h1>
            </div>
            <img className="avatar" src={user.picture} alt={("picture of: ", user.name)} />
        </div>
    )
}

export default HomeGreeting
