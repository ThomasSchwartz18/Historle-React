import React, { useEffect, useState } from 'react'
import { revealAnswer } from '../api/events'
import useAuth from '../hooks/useAuth'

/**
 * Modal to show answer, alt answers, summary, and share options
 */
export default function GameOverModal() {
  const { user, session } = useAuth()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState(null)
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (visible) {
      async function loadAnswer() {
        const { data: answerData, error } = await revealAnswer(todayStr)
        if (error) console.error('Reveal answer error:', error)
        else setData(answerData)
      }
      loadAnswer()
    }
  }, [visible])

  if (!visible || !data) return null

  return (
    <div id="game-over" className="modal show">
      <div className="modal-overlay" onClick={() => setVisible(false)} />
      <div className="modal-content">
        <button className="modal-close" onClick={() => setVisible(false)}>×</button>
        <h2 id="result-header">{data.answer}</h2>
        <p id="correct-answer">Also accepted: {data.alt_answers.join(', ')}</p>
        <div id="event-summary">{data.summary}</div>
        <div className="share-container">
          <button className="share-btn facebook">Share to Facebook</button>
          <button className="share-btn twitter">Share to Twitter</button>
          <button className="share-btn instagram">Share to Instagram</button>
          <button className="share-btn message">Message</button>
        </div>
      </div>
    </div>
  )
}
