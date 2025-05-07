import React, { useEffect, useState } from 'react'
import { fetchUserFullStats } from '../api/users'
import useAuth from '../hooks/useAuth'

/**
 * Displays user statistics in a modal
 */
export default function StatsModal() {
  const { user, session } = useAuth()
  const [stats, setStats] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (user) {
      async function loadStats() {
        const { fullStats, error } = await fetchUserFullStats(user.email)
        if (error) console.error('Failed to load stats', error)
        else setStats(fullStats)
      }
      loadStats()
    }
  }, [user])

  if (!visible || !stats) return null

  return (
    <div id="stats-modal" className="modal show">
      <div className="modal-overlay" onClick={() => setVisible(false)} />
      <div className="modal-content stats-section">
        <button className="modal-close" onClick={() => setVisible(false)}>×</button>
        <h2>Your Statistics</h2>
        <div className="stats-block">
          <span>Streak</span><span>{stats.streak}</span>
        </div>
        <div className="stats-block">
          <span>Wins</span><span>{stats.total_wins}</span>
        </div>
        <div className="stats-block">
          <span>Played</span><span>{stats.days_played}</span>
        </div>
        <div className="stats-block">
          <span>Win %</span><span>{stats.win_percentage}%</span>
        </div>
        <div className="stats-block">
          <span>Longest Streak</span><span>{stats.longest_win_streak}</span>
        </div>
      </div>
    </div>
  )
}
