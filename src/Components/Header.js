import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
export const Header = () => {
  return (
    <div>
        <header>
          <nav>
            <Link to={'/'}>Home</Link>
            <Link to={'/about'}>About</Link>
            <Link to={'/contact'}>Contact</Link>
          </nav>
        </header>
    </div>
  )
}
