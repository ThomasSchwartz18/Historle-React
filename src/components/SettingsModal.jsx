import React, { useState } from 'react'
import { updateXProfile, deleteAccount } from '../api/users'
import useAuth from '../hooks/useAuth'

/**
 * Modal for updating X profile and deleting account
 */
export default function SettingsModal() {
  const { user, session, signOut } = useAuth()
  const [xId, setXId] = useState(user?.x_id || '')
  const [feedback, setFeedback] = useState(null)
  const [visible, setVisible] = useState(false)
  const [confirmUsername, setConfirmUsername] = useState('')

  const handleUpdateX = async () => {
    const { data, error } = await updateXProfile(user.email, xId)
    if (error) setFeedback(error.message)
    else setFeedback('X profile updated!')
  }

  const handleDelete = async () => {
    if (confirmUsername !== user.email) {
      setFeedback('Usernames do not match')
      return
    }
    const { error } = await deleteAccount(user.email)
    if (error) setFeedback(error.message)
    else signOut()
  }

  if (!visible || !session) return null

  return (
    <div id="settings-modal" className={`modal ${visible ? 'show' : 'hidden'}`}>
      <div className="modal-overlay" onClick={() => setVisible(false)} />
      <div className="modal-content">
        <button className="modal-close" onClick={() => setVisible(false)}>×</button>
        <h2>Settings</h2>
        <div className="settings-section">
          <label>Update X Profile:</label>
          <input
            type="text"
            value={xId}
            onChange={(e) => setXId(e.target.value)}
          />
          <button onClick={handleUpdateX}>Update X</button>
        </div>
        <hr />
        <div className="settings-section">
          <label>Delete Account (type your email to confirm):</label>
          <input
            type="text"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
          />
          <button onClick={handleDelete}>Delete Account</button>
        </div>
        {feedback && <p className="error">{feedback}</p>}
      </div>
    </div>
  )
}
