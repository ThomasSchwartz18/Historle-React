import React, { useState } from 'react'
import { signIn, signUp } from '../api/auth'
import useAuth from '../hooks/useAuth'

/**
 * Handles Login/Register within a modal
 */
export default function AuthModal() {
  const { session } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [visible, setVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const action = isRegistering ? signUp : signIn
    const { data, error } = await action({ email, password })
    if (error) setFeedback(error.message)
    else {
      setFeedback(null)
      setVisible(false)
    }
  }

  if (!visible && session) return null

  return (
    <div id="auth-modal" className={`modal ${visible ? 'show' : 'hidden'}`}>
      <div className="modal-overlay" onClick={() => setVisible(false)} />
      <div className="modal-content">
        <button className="modal-close" onClick={() => setVisible(false)}>×</button>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? 'Sign Up' : 'Sign In'}</button>
        </form>
        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login' : 'Register'}
          </span>
        </p>
        {feedback && <p className="auth-error">{feedback}</p>}
      </div>
    </div>
  )
}