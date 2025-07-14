import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../src/App';
import LandingPage from '../src/components/landingPage';
import { LoginPage, SignupPage } from '../src/components/authPages';
import GamePage from '../src/components/GamePage';
import StatsPage from '../src/components/StatsPage';
// import ArticlesPage from '../src/components/';
import SettingsPage from '../src/components/SettingsPage';

export default createBrowserRouter([
  // Public routes (no Nav)
  {
    path: '/',
    element: <LandingPage />,  // Landing page without Nav
  },
  {
    path: '/login',
    element: <LoginPage />,    // Auth pages without Nav
  },
  {
    path: '/signup',
    element: <SignupPage />,   // Auth pages without Nav
  },
  // Protected routes (with Nav)
  {
    element: <App />,         // App includes Nav + Outlet
    children: [
      { path: '/game', element: <GamePage /> },
      { path: '/stats', element: <StatsPage /> },
      // { path: '/articles', element: <ArticlesPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);
