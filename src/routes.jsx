import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../src/components/landingPage';
import {LoginPage, SignupPage} from '../src/components/authPages';
import GamePage from './components/GamePage'

export default createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  { 
    path: '/login', 
    element: <LoginPage /> 
  },
  { 
    path: '/signup', 
    element: <SignupPage /> 
  },
  { 
    path: '/game',   
    element: <GamePage /> 
  },
]);
