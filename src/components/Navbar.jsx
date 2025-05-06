import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../styles/web-logo.png'  // adjust path based on your asset location

export default function Navbar() {
  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <img src={logo} alt="Historle Logo" style={{ height: '40px' }} />
        </Link>
      </div>
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/articles" className="navbar-link">Articles</Link>
        <Link to="/game" className="navbar-link">Play</Link>
        <button className="login-register-navbar-button">Login / Register</button>
      </div>
    </nav>
  )
}
