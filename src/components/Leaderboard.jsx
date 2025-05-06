import React, { useEffect, useState } from 'react'
import { fetchLeaderboard } from '../api/scores'

/**
 * Props:
 *   - dateStr: string ('YYYY-MM-DD')
 */
export default function Leaderboard({ dateStr }) {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    async function loadLeaderboard() {
      const { leaderboard, error } = await fetchLeaderboard(dateStr)
      if (error) console.error('Failed to load leaderboard', error)
      else setEntries(leaderboard)
    }
    loadLeaderboard()
  }, [dateStr])

  if (!entries.length) return <p>No leaderboard data yet.</p>

  return (
    <section className="leaderboard">
      <h2>Top 10 Today</h2>
      <div className="leaderboard-header">
        <span className="rank">#</span>
        <span className="name">Name</span>
        <span className="time">Time</span>
        <span className="clues">Clues</span>
      </div>
      <div className="leaderboard-entries">
        {entries.map((entry, idx) => (
          <div key={entry.id || idx} className="leaderboard-entry">
            <span className="rank">{idx + 1}</span>
            <span className="name">{entry.name}</span>
            <span className="time">{entry.solve_time}</span>
            <span className="clues">{entry.clues_used}</span>
          </div>
        ))}
      </div>
    </section>
  )
}