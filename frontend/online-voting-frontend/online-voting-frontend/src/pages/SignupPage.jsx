import React from 'react'
import { Link } from 'react-router-dom'

// Signup is now handled automatically via Supabase OTP login.
// First-time users are auto-registered when they verify their email.
export default function SignupPage() {
  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/" className="link-small">← Home</Link>
      </div>
      <div className="stub-card" style={{ textAlign: 'center' }}>
        <h2 className="display">No sign-up needed!</h2>
        <p className="subtext" style={{ marginBottom: 24 }}>
          Registration is automatic. Just log in with your email — if you're new,
          you'll be registered the moment you verify your one-time code.
        </p>
        <Link to="/login" className="btn btn-teal" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
          Go to Login →
        </Link>
      </div>
    </div>
  )
}
