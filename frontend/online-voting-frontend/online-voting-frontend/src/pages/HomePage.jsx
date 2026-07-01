import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/admin" className="link-small">Admin</Link>
      </div>

      <div className="stub-card" style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 40 }}>
        <h1 className="display">Welcome to the<br />Online Voting System</h1>
        <p className="subtext">Cast your vote securely, from any device. Registered voters log in below — new voters can sign up with a name and PIN.</p>

        <div className="btn-row">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-outline">Sign up (new voter)</Link>
        </div>

        <p style={{ marginTop: 24 }}>
          <Link to="/results" className="link-small">View election results</Link>
        </p>
      </div>
    </div>
  )
}
