import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TopStreakLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStreaks = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, current_win_streak')
        .order('current_win_streak', { ascending: false }) // highest streak first
        .limit(5);

      console.log('Fetched top streaks:', { data, error });
      if (error) {
        console.error('Error fetching streaks:', error);
      } else if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    };

    // initial load
    fetchStreaks();
    // optional: refresh every minute
    const intervalId = setInterval(fetchStreaks, 60_000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) return <p>Loading streak leaderboard...</p>;
  if (!entries.length) return <p>No streak data available.</p>;

  return (
    <div className="leaderboards-container">
      <div className="leaderboard streak-leaderboard">
        <h2>Top 5 Streaks</h2>
        <div className="leaderboard-header">
          <span className="rank">Rank</span>
          <span className="name">Name</span>
          <span className="streak">Streak</span>
        </div>
        <div className="leaderboard-entries">
          {entries.map((entry, idx) => (
            <div className="leaderboard-entry" key={idx}>
              <div className="rank">{idx + 1}</div>
              <div className="name">{entry.username}</div>
              <div className="streak">🔥{entry.current_win_streak}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
