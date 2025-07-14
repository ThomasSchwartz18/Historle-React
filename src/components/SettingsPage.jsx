import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../assets/css/settingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const userId = session?.user?.id;
        if (!userId) throw new Error('No authenticated user.');

        const { data, error } = await supabase
          .from('profiles')
          .select('username, twitter_handle, facebook_handle, instagram_handle')
          .eq('id', userId)
          .single();
        if (error) throw error;

        if (isMounted) {
          setUsername(data.username || '');
          setTwitterHandle(data.twitter_handle || '');
          setFacebookHandle(data.facebook_handle || '');
          setInstagramHandle(data.instagram_handle || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        if (isMounted) setMessage({ type: 'error', text: `Failed to load profile: ${err.message}` });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const userId = session?.user?.id;
      if (!userId) throw new Error('No authenticated user.');

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          twitter_handle: twitterHandle,
          facebook_handle: facebookHandle,
          instagram_handle: instagramHandle
        })
        .eq('id', userId);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      console.error('Update failed:', err);
      setMessage({ type: 'error', text: `Update failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const userId = session?.user?.id;
      if (!userId) throw new Error('No authenticated user.');

      await supabase.from('profiles').delete().eq('id', userId);
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
      setMessage({ type: 'error', text: `Delete failed: ${err.message}` });
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="settings-page"><p>Loading...</p></div>;
  }

  return (
    <div className="settings-page">
      <h2>Account Settings</h2>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleUpdate} className="settings-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Twitter Handle
          <input
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
          />
        </label>
        <label>
          Facebook Handle
          <input
            type="text"
            value={facebookHandle}
            onChange={(e) => setFacebookHandle(e.target.value)}
          />
        </label>
        <label>
          Instagram Handle
          <input
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
          />
        </label>
        <button type="submit" className="btn">Save Changes</button>
      </form>
      <hr />
      <button onClick={handleDelete} className="btn delete-btn">
        Delete Account
      </button>
    </div>
  );
}
