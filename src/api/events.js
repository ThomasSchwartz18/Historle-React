import { supabase } from '../supabase'

// Helper to format a Date to 'YYYY-MM-DD'
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Fetch today's event (clues only, without answer/summary)
 */
export async function fetchTodayEvent() {
  const todayStr = formatDate(new Date())
  const { data, error } = await supabase
    .from('daily_events')
    .select('year, difficulty, clues, date, category')
    .eq('date', todayStr)
    .single()

  return { event: data, error }
}

/**
 * Reveal the full answer, alt_answers, and summary for a given date
 */
export async function revealAnswer(eventDate) {
  const { data, error } = await supabase
    .from('daily_events')
    .select('answer, alt_answers, summary')
    .eq('date', eventDate)
    .single()

  return { data, error }
}
