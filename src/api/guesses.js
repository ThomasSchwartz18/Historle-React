import { supabase } from '../supabase'

/**
 * Submit a guess for today's event via Supabase Edge Function 'guess'
 * @param {string} guess
 * @param {string} eventDate ('YYYY-MM-DD')
 */
export async function submitGuess(guess, eventDate) {
  const response = await supabase.functions.invoke('guess', {
    body: JSON.stringify({ guess, event_date: eventDate }),
  })
  const { data, error } = response
  return { result: data, error }
}

/**
 * Check if the current user has already played today via Edge Function 'already_played' 
 * @param {string} username
 * @param {string} eventDate
 */
export async function checkAlreadyPlayed(username, eventDate) {
  const response = await supabase.functions.invoke('already_played', {
    body: JSON.stringify({ username, event_date: eventDate }),
  })
  const { data, error } = response
  return { alreadyPlayed: data?.already_played, error }
}
