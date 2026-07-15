import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function AdminLoginPage() {
  const { loginAdmin } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = await loginAdmin(username, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/administration')
  }

  return (
    <div className="page">
      <div className="topbar"><div className="brand">Online Voting<small>System</small></div></div>

      <form className="stub-card" onSubmit={handleSubmit}>
        <h2 className="display">Admin login</h2>
        <p className="subtext">Restricted access. Only authorized election officials may sign in.</p>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, textAlign: 'center', color: 'var(--slate)' }}>
          Default demo credentials — username: admin, password: admin123
        </p>
      </form>
    </div>
  )
}
