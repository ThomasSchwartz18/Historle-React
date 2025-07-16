import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  PieChart, Pie, Cell, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Scatter
} from 'recharts';
import '../assets/css/statsPage.css';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState({
    avgSolveTime: null,
    avgGuesses:   null,
    winRate:      null,
  });
  const [dailyRates, setDailyRates] = useState([]);
  const [guessDist, setGuessDist] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      // 1) Get current user session
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }

      // 2) Fetch profile stats
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('current_win_streak, total_wins, days_played, longest_win_streak')
        .eq('id', userId)
        .single();
      if (isMounted && !profileErr && profileData) {
        const winPct = profileData.total_wins && profileData.days_played
          ? ((profileData.total_wins / profileData.days_played) * 100).toFixed(1)
          : '0.0';
        setStats({ ...profileData, win_percentage: winPct });
      }

      // 3) Aggregated metrics
      const { data: agg, error: aggErr } = await supabase
        .from('leaderboard_stats')
        .select('avg_solve_time, avg_guesses, wins, plays')
        .eq('user_id', userId)
        .single();
      if (isMounted && !aggErr && agg) {
        setMetrics({
          avgSolveTime: agg.avg_solve_time,
          avgGuesses:   agg.avg_guesses,
          winRate:      agg.plays > 0 ? agg.wins / agg.plays : null,
        });
      }

      // 4) Daily win % over time
      const { data: dailyData, error: dailyErr } = await supabase
        .from('leaderboard_daily')
        .select('event_date, wins, plays')
        .eq('user_id', userId)
        .order('event_date', { ascending: true });
      if (isMounted && !dailyErr && dailyData) {
        setDailyRates(
          dailyData.map(d => ({
            date: d.event_date,
            winRate: d.plays > 0 ? (d.wins / d.plays) * 100 : 0
          }))
        );
      }

      // 5) Guess distribution histogram
      const { data: distData, error: distErr } = await supabase
        .from('leaderboard_daily_guesses')
        .select('guesses, count')
        .eq('user_id', userId)
        .order('guesses');
      if (isMounted && !distErr && distData) {
        setGuessDist(distData.map(d => ({ guesses: d.guesses, count: d.count })));
      }

      // 6) Scatter: guesses vs time
      const { data: scat, error: scatErr } = await supabase
        .from('leaderboard')
        .select('guesses, time_taken_ms')
        .eq('user_id', userId);
      if (isMounted && !scatErr && scat) {
        setScatterData(
          scat.map(d => ({ guesses: d.guesses, time: d.time_taken_ms / 1000 }))
        );
      }

      if (isMounted) setLoading(false);
    }

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="stats-page"><p>Loading stats…</p></div>;
  }

  const hasData = stats && stats.days_played > 0;
  const pieData = hasData
    ? [
        { name: 'Wins',   value: stats.total_wins },
        { name: 'Losses', value: stats.days_played - stats.total_wins }
      ]
    : [];
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <div className="stats-page">
      <h2 className="stats-title">Your Historle Dashboard</h2>

      {hasData && (
        <>
          <div className="stats-charts" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            {/* Win vs Loss Pie */}
            <PieChart width={250} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>

          {/* Stats grid below charts */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.current_win_streak}</div>
              <div className="stat-label">🔥 Current Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_wins}</div>
              <div className="stat-label">🏆 Total Wins</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.days_played}</div>
              <div className="stat-label">Days Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{metrics.winRate != null ? (metrics.winRate*100).toFixed(0)+'%' : '–'}</div>
              <div className="stat-label">Overall Win %</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{metrics.avgSolveTime != null ? (metrics.avgSolveTime/1000).toFixed(1)+'s' : '–'}</div>
              <div className="stat-label">Avg Solve Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{metrics.avgGuesses != null ? metrics.avgGuesses.toFixed(2) : '–'}</div>
              <div className="stat-label">Avg Guesses</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
