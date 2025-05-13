import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/images/logo1.png';
import logoutIcon from '../assets/images/logout-icon.png';

export default function Nav() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="container">
      <header>
        <nav className="navbar">
          <div className="navbar-left">
            {session?.user ? (
              <>
                <img src={logo} alt="H" className="nav-icon" />
                <span id="user-greeting">
                  {`ello, ${session.user.user_metadata.username || session.user.email}`}
                </span>
              </>
            ) : (
              <img src={logo} alt="Historle Logo" className="nav-icon" />
            )}
          </div>

          <div className="navbar-right">
            <div className="navbar-links">
              <button onClick={() => navigate('/articles')} className="navbar-link">
                Articles
              </button>

              {session?.user ? (
                <>
                  <button onClick={() => navigate('/stats')} className="navbar-link">
                    Stats
                  </button>
                  <button onClick={() => navigate('/settings')} className="navbar-link">
                    Settings
                  </button>
                  <button onClick={handleLogout} className="navbar-link">
                    <img src={logoutIcon} alt="Logout" className="nav-icon logout-icon" />
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/login')} className="navbar-link">
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
