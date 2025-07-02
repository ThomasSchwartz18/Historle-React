import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import webLogo from '../assets/images/web-logo.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGuest = async () => {
    // Sign out any existing user before guest play
    await supabase.auth.signOut();
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 landing-container">
      <div className='landing-btn-container-top' id='landing-top'>
        <img src={webLogo} alt="Historle Web Logo" className='landing-logo-img'/>
        {/* <h1 className="text-4xl font-bold mb-8 landing-title">Daily Trivia Game</h1> */}
        <div className="space-y-4 landing-btn-container">
          <button
            className="w-48 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 landing-login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="w-48 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 landing-signup-btn"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button
            className="w-48 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 landing-guest-btn"
            onClick={handleGuest}
          >
            Play as Guest
          </button>
        </div>
        <div className='landing-learn-to-play-btn-container'>
          <a href="#learn-to-play" className='landing-learn-to-play-btn'>Learn to Play!</a>
        </div>
      </div>
      <div className='learn-how-to-container'>
        <h2>How to play Historle:</h2>
        <div className='landing-learn-to-play' id='learn-to-play'>
          <ol>
            <li>Signup for an account <i>or</i> play as guest</li>
            <li>Read over displayed clue for a historical Event, Location, or Person</li>
            <li>Input your guess</li>
            <li>Everyday, up to 5 clues can be displayed in order to guess the Historle event - if you guess fast enough you can land yourself on the daily leaderboard</li>
          </ol>
        </div>
        <a href="#landing-top" className='landing-learn-to-play-btn'>
          Scroll up
        </a>
      </div>
      <div className='contact-page'>
        
      </div>
    </div>
  );
}