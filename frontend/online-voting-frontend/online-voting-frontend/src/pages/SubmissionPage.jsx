import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function SubmissionPage() {
  const navigate = useNavigate()
  const { logoutVoter } = useApp()

  function handleDone() {
    logoutVoter()
    navigate('/')
  }

  return (
    <div className="page">
      <div className="topbar"><div className="brand">Online Voting<small>System</small></div></div>
      <div className="stub-card" style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
        <h2 className="display">Vote successfully submitted</h2>
        <p className="subtext">Your vote has been cast and recorded. Thank you for taking part.</p>
        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => navigate('/results')}>View results</button>
          <button className="btn btn-primary" onClick={handleDone}>Done</button>
        </div>
      </div>
    </div>
  )
}
