import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import HomePage from './components/HomePage'
import ArticlesPage from './components/ArticlesPage'

/**
 * Centralized route definitions
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<HomePage />} />
      <Route path="/articles" element={<ArticlesPage />} />
    </Routes>
  )
}