import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

/**
 * Custom hook to manage Supabase auth state.
 * Returns: { session, user, signOut }
 */
export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign out helper
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { session, user, signOut }
}
