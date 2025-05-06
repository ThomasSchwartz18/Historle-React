import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import SettingsModal from './components/SettingsModal'
import StatsModal from './components/StatsModal'
import GameOverModal from './components/GameOverModal'
import AppRoutes from './routes'
import './styles/globals.css'
import './styles/theme.css'
import './styles/share.css'
import './styles/articles.css'

function App() {
  return (
    <Router>
      <Navbar />
      <AuthModal />
      <SettingsModal />
      <StatsModal />
      <GameOverModal />
      <AppRoutes />
    </Router>
  )
}

export default App
