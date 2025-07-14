import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import '../assets/css/statsPage.css';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('current_win_streak, total_wins, days_played, longest_win_streak')
        .eq('id', userId)
        .single();

      if (isMounted) {
        if (!error && data) {
          const winPct = data.total_wins && data.days_played
            ? ((data.total_wins / data.days_played) * 100).toFixed(1)
            : '0.0';
          setStats({ ...data, win_percentage: winPct });
        }
        setLoading(false);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="stats-page">
        <p>Loading stats…</p>
      </div>
    );
  }

  // Always show header; only render charts/cards if there is data
  const hasData = stats && stats.days_played > 0;

  // Prepare chart data
  const chartData = hasData
    ? [
        { name: 'Wins', value: stats.total_wins },
        { name: 'Losses', value: stats.days_played - stats.total_wins }
      ]
    : [];
  
  const COLORS = ['#4CAF50', '#F44336']; // green for Wins, red for Losses

  return (
    <div className="stats-page">
      <h2 className="stats-title">Your Historle Stats</h2>

      {hasData && (
        <>
          <div className="stats-chart">
            <PieChart width={250} height={250}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.current_win_streak}</div>
              <div className="stat-label">Current Win Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_wins}</div>
              <div className="stat-label">Total Wins</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.days_played}</div>
              <div className="stat-label">Days Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.win_percentage}%</div>
              <div className="stat-label">Win Percentage</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.longest_win_streak}</div>
              <div className="stat-label">Longest Win Streak</div>
            </div>
          </div>
        </>
      )}

      {/* If no data, only header is displayed */}
    </div>
  );
}
