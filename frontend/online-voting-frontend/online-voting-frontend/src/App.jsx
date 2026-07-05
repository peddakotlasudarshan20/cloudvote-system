import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import VotingPage from './pages/VotingPage.jsx'
import SubmissionPage from './pages/SubmissionPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdministrationPage from './pages/AdministrationPage.jsx'
import { RequireVoter, RequireAdmin } from './components/ProtectedRoute.jsx'

export default function App() {
  // Application routing structure with voter and admin guards
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/vote" element={<RequireVoter><VotingPage /></RequireVoter>} />
      <Route path="/submitted" element={<RequireVoter><SubmissionPage /></RequireVoter>} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/administration" element={<RequireAdmin><AdministrationPage /></RequireAdmin>} />
    </Routes>
  )
}
