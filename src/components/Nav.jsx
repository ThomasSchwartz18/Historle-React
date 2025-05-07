import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Nav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <nav className="w-full bg-white border-b p-4 flex justify-end space-x-4">
      <button
        onClick={goHome}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        Home
      </button>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
