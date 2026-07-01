import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function AdministrationPage() {
  const {
    data, logoutAdmin, adminAddCandidate, adminRemoveCandidate,
    adminAddVoter, adminRemoveVoter, setElectionSchedule
  } = useApp()
  const navigate = useNavigate()

  const [candName, setCandName] = useState('')
  const [candSymbol, setCandSymbol] = useState('')
  const [candError, setCandError] = useState('')

  const [voterName, setVoterName] = useState('')
  const [voterPin, setVoterPin] = useState('')
  const [voterError, setVoterError] = useState('')

  const [date, setDate] = useState(data.election.date)
  const [startTime, setStartTime] = useState(data.election.startTime)
  const [endTime, setEndTime] = useState(data.election.endTime)
  const [scheduleSaved, setScheduleSaved] = useState(false)

  const totalVoters = data.voters.length
  const totalVoted = data.voters.filter(v => v.hasVoted).length

  function handleAddCandidate(e) {
    e.preventDefault()
    const result = adminAddCandidate(candName, candSymbol)
    if (!result.ok) { setCandError(result.message); return }
    setCandError('')
    setCandName('')
    setCandSymbol('')
  }

  function handleAddVoter(e) {
    e.preventDefault()
    const result = adminAddVoter(voterName, voterPin)
    if (!result.ok) { setVoterError(result.message); return }
    setVoterError('')
    setVoterName('')
    setVoterPin('')
  }

  function handleSaveSchedule(e) {
    e.preventDefault()
    setElectionSchedule(date, startTime, endTime)
    setScheduleSaved(true)
    setTimeout(() => setScheduleSaved(false), 2000)
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>Administration</small></div>
        <button className="link-small" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => { logoutAdmin(); navigate('/') }}>Log out</button>
      </div>

      <div className="stat-grid">
        <div className="stat-box"><div className="num">{data.candidates.length}</div><div className="label">Candidates</div></div>
        <div className="stat-box"><div className="num">{totalVoters}</div><div className="label">Voters</div></div>
        <div className="stat-box"><div className="num">{totalVoted}</div><div className="label">Votes cast</div></div>
        <div className="stat-box"><div className="num">{totalVoters - totalVoted}</div><div className="label">Pending</div></div>
      </div>

      {/* Election schedule */}
      <form className="stub-card" onSubmit={handleSaveSchedule}>
        <h2 className="display" style={{ fontSize: 18 }}>Election schedule</h2>
        <p className="subtext">Set the date and voting window. Voters can only submit a vote within this window.</p>
        <div className="field">
          <label htmlFor="date">Voting date</label>
          <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="start">Start time</label>
          <input id="start" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="end">End time</label>
          <input id="end" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        </div>
        {scheduleSaved && <div className="success-banner">Schedule saved.</div>}
        <button type="submit" className="btn btn-teal">Save schedule</button>
      </form>

      {/* Candidate registration */}
      <div className="section-title">Candidate registration</div>
      <form className="stub-card" onSubmit={handleAddCandidate}>
        <p className="subtext">Register candidates standing in the election with their name and symbol.</p>
        <div className="field">
          <label htmlFor="candName">Candidate name</label>
          <input id="candName" value={candName} onChange={e => setCandName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="candSymbol">Symbol</label>
          <input id="candSymbol" value={candSymbol} onChange={e => setCandSymbol(e.target.value)} placeholder="e.g. 🌳 or a short code" required />
        </div>
        {candError && <p className="error-text">{candError}</p>}
        <button type="submit" className="btn btn-primary">Add candidate</button>

        {data.candidates.length > 0 && (
          <table className="data-table" style={{ marginTop: 20 }}>
            <thead><tr><th>Name</th><th>Symbol</th><th>Votes</th><th></th></tr></thead>
            <tbody>
              {data.candidates.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className="symbol-box">{c.symbol}</span></td>
                  <td>{c.votes}</td>
                  <td><button type="button" className="link-small" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} onClick={() => adminRemoveCandidate(c.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>

      {/* Voter registration */}
      <div className="section-title">Voter registration</div>
      <form className="stub-card" onSubmit={handleAddVoter}>
        <p className="subtext">Register eligible voters. Voters can also self-register from the home page sign-up form.</p>
        <div className="field">
          <label htmlFor="voterName">Voter name</label>
          <input id="voterName" value={voterName} onChange={e => setVoterName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="voterPin">PIN</label>
          <input id="voterPin" value={voterPin} onChange={e => setVoterPin(e.target.value)} required />
        </div>
        {voterError && <p className="error-text">{voterError}</p>}
        <button type="submit" className="btn btn-primary">Add voter</button>

        {data.voters.length > 0 && (
          <table className="data-table" style={{ marginTop: 20 }}>
            <thead><tr><th>Name</th><th>PIN</th><th>Voted?</th><th></th></tr></thead>
            <tbody>
              {data.voters.map(v => (
                <tr key={v.pin}>
                  <td>{v.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{v.pin}</td>
                  <td>{v.hasVoted ? 'Yes' : 'No'}</td>
                  <td><button type="button" className="link-small" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} onClick={() => adminRemoveVoter(v.pin)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>
    </div>
  )
}
