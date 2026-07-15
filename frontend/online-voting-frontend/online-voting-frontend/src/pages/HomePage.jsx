import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function HomePage() {
  const { supabaseUser } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (supabaseUser) {
      navigate('/vote')
    }
  }, [supabaseUser, navigate])

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/admin" className="link-small">Admin</Link>
      </div>

      <div className="stub-card" style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 40 }}>
        <h1 className="display">Welcome to the<br />Online Voting System</h1>
        <p className="subtext">
          Cast your vote securely, from any device.<br />
          New here? Register first. Already signed up? Log in to vote or check your status.
        </p>

        <div className="btn-row">
          <Link to="/signup" className="btn btn-teal">📋 Register to vote</Link>
          <Link to="/login" className="btn btn-primary">🔑 Already registered? Log in</Link>
        </div>

        <p style={{ marginTop: 24 }}>
          <Link to="/results" className="link-small">View election results</Link>
        </p>
      </div>
    </div>
  )
}
