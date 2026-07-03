import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (!password) { setError('Please enter your password.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    })

    setLoading(false)
    if (err) {
      setError(err.message || 'Failed to log in. Please try again.')
      return
    }
    navigate('/vote')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/" className="link-small">← Home</Link>
      </div>

      <form className="stub-card" onSubmit={handleLogin}>
        <h2 className="display">Voter login</h2>
        <p className="subtext">
          Already registered? Enter your email and password to log in and vote.
        </p>

        <div className="field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : '🔑 Log in'}
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: 13, textAlign: 'center', color: 'var(--slate)' }}>
          New voter?{' '}
          <Link to="/signup" style={{ color: 'var(--teal)' }}>Register here</Link>
        </p>
      </form>
    </div>
  )
}
