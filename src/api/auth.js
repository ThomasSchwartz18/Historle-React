import { supabase } from '../supabase'

// Sign up a new user with email and password
export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

// Sign in existing user
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// Sign out the current user
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current session (if any)
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
