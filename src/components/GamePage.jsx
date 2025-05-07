import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

// Helper to get local YYYY-MM-DD date string
function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function GamePage() {
  const navigate = useNavigate();
  const [trivia, setTrivia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clueIndex, setClueIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

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
      } finally {
        setLoading(false);
      }
    }
    fetchTrivia();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedGuess = guess.trim().toLowerCase();
    const correct =
      normalizedGuess === trivia.answer.toLowerCase() ||
      trivia.altAnswers.map((a) => a.toLowerCase()).includes(normalizedGuess);

    if (correct) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
      setClueIndex((prev) => Math.min(prev + 1, trivia.clues.length - 1));
    }
    setGuess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading trivia...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">
          {trivia.category} - {trivia.difficulty}
        </h1>

        <div className="w-full max-w-xl bg-white p-6 rounded shadow">
          {status !== 'correct' && (
            <p className="text-lg mb-4">Clue: {trivia.clues[clueIndex]}</p>
          )}

          {status === 'correct' ? (
            <div>
              <p className="text-green-600 font-semibold mb-2">
                🎉 Correct! The answer is: {trivia.answer}
              </p>
              <p className="mb-4">{trivia.summary}</p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Enter your guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
              {status === 'incorrect' && (
                <p className="text-red-500">Incorrect, try the next clue!</p>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Guess
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
