import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '0 1rem'
    }}>
      <h1>Welcome to Historle</h1>
      <p>Guess a historical event each day and climb the leaderboard!</p>
      <button
        onClick={() => navigate('/game')}
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1.25rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Play Now
      </button>
    </div>
  )
}
