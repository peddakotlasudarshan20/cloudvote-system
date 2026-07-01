import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function LoginPage() {
  const { loginVoter } = useApp()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const result = loginVoter(pin, name)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/vote')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
      </div>

      <form className="stub-card" onSubmit={handleSubmit}>
        <h2 className="display">Voter login</h2>
        <p className="subtext">Enter the PIN and name you registered with.</p>

        <div className="field">
          <label htmlFor="pin">PIN</label>
          <input id="pin" value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. 4821" required />
        </div>

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>

        <p style={{ marginTop: 18, fontSize: 13, textAlign: 'center', color: 'var(--slate)' }}>
          New voter? <Link to="/signup" className="link-small">Sign up here</Link>
        </p>
      </form>
    </div>
  )
}
