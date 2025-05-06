import React, { useEffect, useState } from 'react'
import { fetchTodayEvent } from '../api/events'
import CluesDisplay from './CluesDisplay'
import GuessForm from './GuessForm'
import ProgressBar from './ProgressBar'
import Leaderboard from './Leaderboard'
import StreakBoard from './StreakBoard'
import { format } from 'date-fns'

export default function HomePage() {
  const [event, setEvent] = useState(null)
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    async function loadEvent() {
      const { event: evt, error } = await fetchTodayEvent()
      if (error) console.error('Failed to load event', error)
      else setEvent(evt)
    }
    loadEvent()
  }, [])

  if (!event) return <p>Loading event...</p>

  return (
    <main>
      <div className="game-section">
        <div className="category-display">{event.category}</div>
        <CluesDisplay clues={event.clues} />
        <ProgressBar totalClues={event.clues.length} />
        <GuessForm eventDate={todayStr} />
      </div>
      <Leaderboard dateStr={todayStr} />
      <StreakBoard />
    </main>
  )
}
