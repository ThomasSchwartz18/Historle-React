import React, { useEffect, useState } from 'react'
import { fetchStreakLeaderboard } from '../api/scores'

/**
 * Displays top 5 users by current streak
 */
export default function StreakBoard() {
  const [streaks, setStreaks] = useState([])

  useEffect(() => {
    async function loadStreaks() {
      const { streakLeaderboard, error } = await fetchStreakLeaderboard()
      if (error) console.error('Failed to load streak leaderboard', error)
      else setStreaks(streakLeaderboard)
    }
    loadStreaks()
  }, [])

  if (!streaks.length) return null

  return (
    <section className="streak-leaderboard">
      <h2>Top Streaks</h2>
      <div className="leaderboard-entries">
        {streaks.map((user, idx) => (
          <div key={idx} className="leaderboard-entry">
            <span className="rank">{idx + 1}</span>
            <span className="name">{user.username}</span>
            <span className="streak">{user.streak}</span>
          </div>
        ))}
      </div>
    </section>
  )
}