import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function VotingPage() {
  const { data, getCurrentVoter, castVote, isElectionOpen, logoutVoter } = useApp()
  const navigate = useNavigate()
  const voter = getCurrentVoter()
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  if (voter?.hasVoted) {
    return (
      <div className="page">
        <div className="topbar"><div className="brand">Online Voting<small>System</small></div></div>
        <div className="stub-card" style={{ textAlign: 'center' }}>
          <h2 className="display">You've already voted</h2>
          <p className="subtext">Each voter may cast a vote only once. Thank you for participating.</p>
          <button className="btn btn-outline" onClick={() => navigate('/results')}>View results</button>
        </div>
      </div>
    )
  }

  function handleSubmit() {
    if (!selected) {
      setError('Select a candidate before submitting.')
      return
    }
    if (!isElectionOpen()) {
      setError('Voting is currently closed. Check the election schedule set by the admin.')
      return
    }
    const result = castVote(selected)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/submitted')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <button className="link-small" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => { logoutVoter(); navigate('/') }}>Log out</button>
      </div>

      <div className="stub-card">
        <h2 className="display">Cast your vote</h2>
        <p className="subtext">Hello {voter?.name}. Select one candidate, then submit.</p>

        {!isElectionOpen() && (
          <div className="error-text" style={{ marginBottom: 14 }}>
            Voting window is currently closed for today's schedule.
          </div>
        )}

        {data.candidates.length === 0 ? (
          <p className="subtext">No candidates have been registered yet. Check back once the admin adds candidates.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Candidate</th><th>Symbol</th><th>Vote</th></tr>
            </thead>
            <tbody>
              {data.candidates.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className="symbol-box">{c.symbol}</span></td>
                  <td>
                    <div
                      className={`vote-check ${selected === c.id ? 'checked' : ''}`}
                      onClick={() => setSelected(c.id)}
                      role="checkbox"
                      aria-checked={selected === c.id}
                      tabIndex={0}
                    >
                      {selected === c.id ? '✓' : ''}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {error && <p className="error-text" style={{ marginTop: 14 }}>{error}</p>}

        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-teal" onClick={handleSubmit} disabled={data.candidates.length === 0}>Submit</button>
        </div>
      </div>
    </div>
  )
}
