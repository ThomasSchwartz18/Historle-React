import React, { useState } from 'react'
import { submitGuess } from '../api/guesses'

/**
 * Props:
 *   - eventDate: string ('YYYY-MM-DD')
 */
export default function GuessForm({ eventDate }) {
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!guess.trim()) return

    const { result, error } = await submitGuess(guess.trim(), eventDate)
    if (error) {
      console.error('Guess error:', error)
      setFeedback({ type: 'error', message: 'Submission failed.' })
    } else {
      setFeedback({ type: 'success', message: result.correct ? 'Correct!' : 'Try again.' })
    }
    setGuess('')
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter your guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button type="submit">Submit</button>
      </div>
      {feedback && (
        <p className={feedback.type === 'error' ? 'error' : 'success'}>
          {feedback.message}
        </p>
      )}
    </form>
  )
}