import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Nav from './Nav';
import GameOverModal from './GameOverModal';
import TopTenLeaderboard from './TopTenLeaderboard';
import TopStreakLeaderboard  from './TopStreakLeaderboard';

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function GamePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);
  const [trivia, setTrivia] = useState(null);
  const [clueIndex, setClueIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchUsername(session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (session?.user?.id) fetchUsername(session.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchUsername(uid) {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uid)
      .single();

    if (!error && data) setUsername(data.username);
  }

  useEffect(() => {
    async function fetchTrivia() {
      try {
        const today = getLocalDateString();
        const { data, error: fetchError } = await supabase
          .from('trivia')
          .select('answer, alt_answers, clues, summary, difficulty, category')
          .eq('date', today)
          .maybeSingle();
        if (fetchError) throw fetchError;
        if (!data) throw new Error('No trivia found for today.');
        setTrivia({
          answer: data.answer,
          altAnswers: data.alt_answers.split(';'),
          clues: data.clues.split(';'),
          summary: data.summary,
          difficulty: data.difficulty,
          category: data.category,
        });
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTrivia();
  }, []);

  const updateStats = async (isWin) => {
    if (!session?.user) return;
    const userId = session.user.id;
    const today = getLocalDateString();
    const { error: updateError } = await supabase.rpc('update_user_stats', {
      uid: userId,
      today_date: today,
      is_win: isWin
    });
    if (updateError) console.error('Error updating stats:', updateError.message);
  };

  const insertLeaderboard = async (isWin) => {
    if (!session?.user || !username || !trivia) return;

    const today = getLocalDateString();
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeTakenSeconds % 60).toString().padStart(2, '0');
    const formattedTime = `${minutes}:${seconds}`;

    const { error } = await supabase.from('leaderboard').insert({
      date: today,
      username,
      time: formattedTime,
      clues_used: isWin ? clueIndex + 1 : 6
    });
    if (error) console.error('Leaderboard insert error:', error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalized = guess.trim().toLowerCase();
    const isCorrect =
      normalized === trivia.answer.toLowerCase() ||
      trivia.altAnswers.map(a => a.toLowerCase()).includes(normalized);

    if (isCorrect) {
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 }, zIndex: 2000 });
      await updateStats(true);
      await insertLeaderboard(true);
      setModalProps({
        resultHeader: 'Congratulations!',
        correctAnswer: trivia.answer,
        summary: trivia.summary,
        allClues: trivia.clues,
        showNameEntry: true
      });
      setModalVisible(true);
    } else if (clueIndex === trivia.clues.length - 1) {
      await updateStats(false);
      await insertLeaderboard(false);
      setModalProps({
        resultHeader: 'Game Over',
        correctAnswer: trivia.answer,
        summary: trivia.summary,
        allClues: trivia.clues,
        showNameEntry: false
      });
      setModalVisible(true);
    } else {
      setClueIndex(i => i + 1);
    }
    setGuess('');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (error) return <p className="auth-error">Error: {error}</p>;
  if (!trivia) return <p>Loading...</p>;

  const remaining = trivia.clues.length - clueIndex;
  const progress = (remaining / trivia.clues.length) * 100;

  return (
    <>
      <div className="container">
        <main>
          <div className="game-section">
            <div className="game-container">
              <div className="game-box">
                <div className="difficulty-display" aria-label="Event Difficulty">
                  Today's Difficulty: <span id="event-difficulty">{trivia.difficulty}</span>
                </div>
                <div className="category-display" aria-label="Event Category">
                  Category: <b><span id="event-year">{trivia.category}</span></b>
                </div>
                <div className="game-box">
                  <div className="clues-container">
                    <p><i>hints:</i></p>
                    <div className="clue current-clue" id="current-clue" aria-live="polite">
                      {trivia.clues[clueIndex]}
                    </div>
                    <div className="previous-clues" id="previous-clues">
                      {trivia.clues.slice(0, clueIndex).map((c, i) => (
                        <p key={i} className="clue">{c}</p>
                      ))}
                    </div>
                  </div>
                  <form id="guess-form" className="guess-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="guess-input"
                        placeholder="Take a guess."
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        required
                      />
                      <button type="submit">
                        <span className="arrow-icon">Submit</span>
                      </button>
                    </div>
                    <p className="clues-remaining">
                      Remaining guesses: <span id="guesses-left">{remaining}</span>
                    </p>
                  </form>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      id="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="leaderboards-container">
                  <TopTenLeaderboard />
                  <TopStreakLeaderboard />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <GameOverModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmitScore={async () => {
          // you might also want to grab the playerName / xUsername here
          await insertLeaderboard(true);
          handleCloseModal();
        }}
        {...modalProps}
      />
    </>
  );
}
