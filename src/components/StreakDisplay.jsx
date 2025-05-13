import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StreakDisplay() {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    async function fetchStreak() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('current_win_streak')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setStreak(data.current_win_streak);
      }
    }

    fetchStreak();
  }, []);

  return (
    <div className="streak-section">
      <div className="streak-container">
        <span className="streak-display">🔥</span>
        <span id="user-streak">{streak !== null ? `Current Win Streak: ${streak}` : '...'}</span>
      </div>
    </div>
  );
}
