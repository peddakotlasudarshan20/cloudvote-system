import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSendLink(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin + '/vote'
      }
    })

    setLoading(false)
    if (err) {
      setError(err.message || 'Failed to send link. Please try again.')
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
        <form className="stub-card" onSubmit={handleSendLink}>
          <h2 className="display">Voter login</h2>
          <p className="subtext">
            Enter your email address and we'll send you a magic link to sign in instantly — no password needed.
          </p>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-row">
            <button type="submit" className="btn btn-teal" disabled={loading}>
              {loading ? 'Sending…' : '✉ Send magic link'}
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, textAlign: 'center', color: 'var(--slate)' }}>
            First time? Entering your email will register you automatically.
          </p>
        </form>
      ) : (
        <div className="stub-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 className="display">Check your inbox!</h2>
          <p className="subtext">
            We sent a magic link to <strong>{email}</strong>.<br />
            Click the link in the email to sign in and cast your vote.
          </p>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 20 }}>
            Didn't receive it?{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', textDecoration: 'underline', fontSize: 13, padding: 0 }}
            >
              Try again
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
