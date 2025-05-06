import { supabase } from '../supabase'

/**
 * Fetch basic user stats (streak)
 */
export async function fetchUserStats(username) {
  const { data, error } = await supabase
    .from('users')
    .select('streak')
    .eq('username', username)
    .single()

  return { stats: data, error }
}

/**
 * Fetch full user stats (streak, total_wins, days_played, win_percentage, longest_win_streak)
 */
export async function fetchUserFullStats(username) {
  const { data, error } = await supabase
    .from('users')
    .select('streak, total_wins, days_played, longest_win_streak')
    .eq('username', username)
    .single()

  if (data) {
    const winPercentage = data.days_played
      ? Math.round((data.total_wins / data.days_played) * 10000) / 100
      : 0
    return { fullStats: { ...data, win_percentage: winPercentage }, error: null }
  }

  return { fullStats: null, error }
}

/**
 * Update the user X (Twitter) profile handle
 */
export async function updateXProfile(username, newXId) {
  const { data, error } = await supabase
    .from('users')
    .update({ x_id: newXId })
    .eq('username', username)

  return { data, error }
}

/**
 * Delete the user account
 */
export async function deleteAccount(username) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('username', username)

  return { data, error }
}
