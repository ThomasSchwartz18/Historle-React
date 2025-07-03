import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TopTenLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
  
    const fetchLeaderboard = async () => {
      console.log('Supabase session:', await supabase.auth.getSession());

      // Then fetch some raw rows without any filter
      const { data: rawData, error: rawError } = await supabase
        .from('leaderboard')
        .select('date, username, time, clues_used')
        .limit(5);

      console.log('Raw leaderboard rows (no filter):', { rawData, rawError });
      // Guaranteed YYYY-MM-DD format, matching your DATE column
      const today = new Date().toLocaleDateString('en-CA');
      console.log('Filtering for date:', today);
  
      const { data, error } = await supabase
        .from('leaderboard')
        .select('username, time, clues_used')
        .eq('date', today)                       // simple equality on DATE column
        .order('time',      { ascending: true })
        .order('clues_used',{ ascending: true })
        .limit(10);
  
      console.log('Leaderboard data:', { data, error });
      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    };
  
    // initial fetch + 10s polling
    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 10_000);
  
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);  

  if (loading) return <p>Loading leaderboard...</p>;
  if (!entries.length) return <p>No scores for today yet.</p>;

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
