import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function VotingPage() {
  const { data, getCurrentVoter, castVote, isElectionOpen, logoutVoter } = useApp()
  const navigate = useNavigate()
  const voter = getCurrentVoter()
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [modalCandidate, setModalCandidate] = useState(null)

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
    if (!selected) { setError('Select a candidate before submitting.'); return }
    if (!isElectionOpen()) { setError('Voting is currently closed. Check the election schedule set by the admin.'); return }
    const result = castVote(selected)
    if (!result.ok) { setError(result.message); return }
    navigate('/submitted')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <button className="link-small" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => { logoutVoter(); navigate('/') }}>Log out</button>
      </div>

      <div className="stub-card" style={{ maxWidth: 520 }}>
        <h2 className="display">Cast your vote</h2>
        <p className="subtext">Hello {voter?.name}. Tap a candidate to learn more, then select and submit.</p>

        {!isElectionOpen() && (
          <div className="error-text" style={{ marginBottom: 14 }}>
            Voting window is currently closed for today's schedule.
          </div>
        )}

        {data.candidates.length === 0 ? (
          <p className="subtext">No candidates have been registered yet. Check back once the admin adds candidates.</p>
        ) : (
          <div className="candidate-list">
            {data.candidates.map(c => (
              <div
                key={c.id}
                className={`candidate-card ${selected === c.id ? 'candidate-card--selected' : ''}`}
                onClick={() => setSelected(c.id)}
              >
                {/* Left: party logo */}
                <div
                  className="candidate-logo-box"
                  onClick={e => { e.stopPropagation(); setModalCandidate(c) }}
                  title="View candidate details"
                >
                  {c.partyLogoUrl
                    ? <img src={c.partyLogoUrl} alt={c.party || 'Party logo'} className="candidate-logo-img" />
                    : <span className="candidate-logo-emoji">{c.partyLogo || c.symbol || '🗳️'}</span>
                  }
                </div>

                {/* Center: name + party — clickable to open modal */}
                <div
                  className="candidate-info"
                  onClick={e => { e.stopPropagation(); setModalCandidate(c) }}
                  title="View candidate details"
                >
                  <div className="candidate-name">{c.name}</div>
                  <div className="candidate-party">{c.party || 'Independent'}</div>
                </div>

                {/* Right: select radio */}
                <div
                  className={`vote-check ${selected === c.id ? 'checked' : ''}`}
                  role="radio"
                  aria-checked={selected === c.id}
                  tabIndex={0}
                  onKeyDown={e => e.key === ' ' && setSelected(c.id)}
                >
                  {selected === c.id ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="error-text" style={{ marginTop: 14 }}>{error}</p>}

        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-teal" onClick={handleSubmit} disabled={data.candidates.length === 0}>
            Submit vote
          </button>
        </div>
      </div>

      {/* ── Candidate detail modal ── */}
      {modalCandidate && (
        <div className="modal-overlay" onClick={() => setModalCandidate(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalCandidate(null)} aria-label="Close">✕</button>

            {/* Candidate photo */}
            {modalCandidate.photoUrl && (
              <div className="modal-photo-wrap">
                <img src={modalCandidate.photoUrl} alt={modalCandidate.name} className="modal-photo" />
              </div>
            )}

            <h2 className="modal-candidate-name">{modalCandidate.name}</h2>

            <p className="modal-bio">
              {modalCandidate.bio || 'No additional information has been provided for this candidate.'}
            </p>

            <div className="modal-divider" />

            {/* Party row */}
            <div className="modal-party-row">
              <div className="modal-party-logo-box">
                {modalCandidate.partyLogoUrl
                  ? <img src={modalCandidate.partyLogoUrl} alt={modalCandidate.party || 'Party'} className="modal-party-logo-img" />
                  : <span>{modalCandidate.partyLogo || modalCandidate.symbol || '🗳️'}</span>
                }
              </div>
              <div className="modal-party-info">
                <div className="modal-party-label">Party</div>
                <div className="modal-party-name">{modalCandidate.party || 'Independent'}</div>
              </div>
            </div>

            <button
              className="btn btn-teal"
              style={{ marginTop: 24 }}
              onClick={() => { setSelected(modalCandidate.id); setModalCandidate(null) }}
            >
              {selected === modalCandidate.id ? '✓ Selected' : 'Select this candidate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
