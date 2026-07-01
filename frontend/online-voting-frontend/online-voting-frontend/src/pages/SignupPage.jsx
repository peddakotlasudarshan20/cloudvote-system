import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function SignupPage() {
  const { signupVoter, loginVoter } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const result = signupVoter(name, pin)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    setSuccess(true)
    loginVoter(pin, name)
    setTimeout(() => navigate('/vote'), 900)
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
      </div>

      <form className="stub-card" onSubmit={handleSubmit}>
        <h2 className="display">New voter sign up</h2>
        <p className="subtext">Register with your name and choose a PIN. Keep the PIN safe — you'll need it to log in and vote.</p>

        {success && <div className="success-banner">Registered! Taking you to the voting page…</div>}

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
        </div>

        <div className="field">
          <label htmlFor="pin">Choose a PIN</label>
          <input id="pin" value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. 4821" required />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Sign up</button>
        </div>

        <p style={{ marginTop: 18, fontSize: 13, textAlign: 'center', color: 'var(--slate)' }}>
          Already registered? <Link to="/login" className="link-small">Log in</Link>
        </p>
      </form>
    </div>
  )
}
