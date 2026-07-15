import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase.js'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: window.location.origin + '/vote',
        data: { full_name: name.trim() }   // stored in user metadata
      }
    })

    setLoading(false)
    if (err) {
      setError(err.message || 'Failed to register. Please try again.')
      return
    }
    setSent(true)
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/" className="link-small">← Home</Link>
      </div>

      {!sent ? (
        <form className="stub-card" onSubmit={handleRegister}>
          <h2 className="display">Register to vote</h2>
          <p className="subtext">
            New voter? Create your account with an email and password.
            We will send a link to confirm your email.
          </p>

          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          {error && (
            <p className="error-text">
              {error.message || JSON.stringify(error)}
            </p>
          )}

          <div className="btn-row">
            <button type="submit" className="btn btn-teal" disabled={loading}>
              {loading ? 'Registering…' : 'Register & Send Confirming Link'}
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, textAlign: 'center', color: 'var(--slate)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--teal)' }}>Log in here</Link>
          </p>
        </form>
      ) : (
        <div className="stub-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 className="display">Check your inbox!</h2>
          <p className="subtext">
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Please check your email and click the link to confirm your account and log in.
          </p>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 8 }}>
            Not in inbox? Check your <strong>Spam</strong> or <strong>Trash</strong> folder.
          </p>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 20 }}>
            <button
              type="button"
              onClick={() => { setSent(false); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', textDecoration: 'underline', fontSize: 13, padding: 0 }}
            >
              Go back
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
