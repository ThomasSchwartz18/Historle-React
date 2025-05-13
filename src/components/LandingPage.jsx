import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGuest = async () => {
    // Sign out any existing user before guest play
    await supabase.auth.signOut();
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Daily Trivia Game</h1>
      <div className="space-y-4">
        <button
          className="w-48 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="w-48 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
        <button
          className="w-48 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={handleGuest}
        >
          Play as Guest
        </button>
      </div>
    </div>
  );
}