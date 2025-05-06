import { useState, useEffect } from 'react'
import { fetchUserStats } from '../api/users'
import { useAuth } from './useAuth'

/**
 * Custom hook to fetch user's basic stats (streak)
 * Returns: { streak, loading, error }
 */
export default function useUserStats() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadStats() {
      setLoading(true)
      const { stats, error } = await fetchUserStats(user.email)
      if (error) {
        setError(error.message)
      } else {
        setStreak(stats.streak)
      }
      setLoading(false)
    }
    loadStats()
  }, [user])

  return { streak, loading, error }
}
