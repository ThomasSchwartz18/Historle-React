import { useState, useEffect } from 'react'
import { fetchTodayEvent } from '../api/events'

/**
 * Custom hook to fetch and cache today's event
 * Returns: { event, loading, error }
 */
export default function useEvent() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEvent() {
      setLoading(true)
      const { event: evt, error } = await fetchTodayEvent()
      if (error) {
        setError(error.message)
      } else {
        setEvent(evt)
      }
      setLoading(false)
    }
    loadEvent()
  }, [])

  return { event, loading, error }
}
