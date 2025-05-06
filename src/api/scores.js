import { supabase } from '../supabase'

/**
 * Fetch today's top leaderboard entries
 * @param {string} dateStr 'YYYY-MM-DD'
 */
export async function fetchLeaderboard(dateStr) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('date', dateStr)
    .lte('clues_used', 5)
    .order('solve_time', { ascending: true })
    .order('clues_used', { ascending: true })
    .limit(10)

  return { leaderboard: data, error }
}

/**
 * Fetch top 5 users by current streak
 */
export async function fetchStreakLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select('username, streak, x_id')
    .order('streak', { ascending: false })
    .limit(5)

  return { streakLeaderboard: data, error }
}

/**
 * Submit a score entry via Supabase Edge Function 'submit_score'
 * @param {Object} scoreData { username, solveTime, cluesUsed, eventDate, win }
 */
export async function submitScore(scoreData) {
  const { data, error } = await supabase.functions.invoke('submit_score', {
    body: JSON.stringify({
      username: scoreData.username,
      solve_time: scoreData.solveTime,
      clues_used: scoreData.cluesUsed,
      event_date: scoreData.eventDate,
      win: scoreData.win
    }),
  })

  return { result: data, error }
}
