import React from 'react'

/**
 * Displays the list of clues, marking the latest as the current clue
 * Props:
 *   - clues: array of strings
 */
export default function CluesDisplay({ clues = [] }) {
  if (!clues.length) return null

  // All clues except the last are previous; last is current
  const previousClues = clues.slice(0, -1)
  const currentClue = clues[clues.length - 1]

  return (
    <div className="clues-container">
      {previousClues.map((clue, idx) => (
        <p key={idx} className="previous-clues clue">
          {clue}
        </p>
      ))}
      <p className="current-clue">{currentClue}</p>
    </div>
  )
}