import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TopTenLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('leaderboard')
        .select('username, time, clues_used')
        .eq('date', today)
        .order('clues_used', { ascending: true })
        .order('time', { ascending: true })
        .limit(10);

      if (!error) setEntries(data);
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="leaderboards-container">
      <div className="leaderboard">
        <h2>Top 10 Leaderboard</h2>
        <div className="leaderboard-header">
          <span className="rank">Rank</span>
          <span className="name">Name</span>
          <span className="time">Time</span>
          <span className="clues">Clues</span>
        </div>
        <div className="leaderboard-entries">
          {entries.map((entry, index) => (
            <div className="leaderboard-entry" key={index}>
              <div className="rank">{index + 1}</div>
              <div className="name">{entry.username}</div>
              <div className="time">{entry.time}</div>
              <div className="clues">{entry.clues_used}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
