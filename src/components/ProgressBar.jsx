import React from 'react'

/**
 * Props:
 *   - totalClues: total number of clues available
 *   - usedClues: number of clues already revealed (optional)
 */
export default function ProgressBar({ totalClues = 0, usedClues = 0 }) {
  const progressPercent = totalClues > 0
    ? ((totalClues - usedClues) / totalClues) * 100
    : 100

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  )
}