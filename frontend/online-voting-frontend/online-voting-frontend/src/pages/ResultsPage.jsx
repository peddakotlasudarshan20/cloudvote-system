import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function ResultsPage() {
  const { data } = useApp()
  const { candidates, voters } = data

  const totalVoters = voters.length
  const totalVoted = voters.filter(v => v.hasVoted).length
  const totalCandidates = candidates.length
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes)
  const winner = sorted.length > 0 && sorted[0].votes > 0 ? sorted[0] : null
  const isTie = sorted.length > 1 && sorted[0].votes === sorted[1]?.votes && sorted[0].votes > 0

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">Online Voting<small>System</small></div>
        <Link to="/" className="link-small">Home</Link>
      </div>

      <div className="stub-card">
        {winner && !isTie ? (
          <div className="winner-banner">
            <div className="trophy">🏆</div>
            <h2 className="display">The {winner.name} has been the winner as {winner.symbol}!</h2>
            <p className="subtext">Congratulations!</p>
          </div>
        ) : isTie ? (
          <div className="winner-banner">
            <h2 className="display">It's currently a tie</h2>
            <p className="subtext">Results will be finalized once voting closes.</p>
          </div>
        ) : (
          <div className="winner-banner">
            <h2 className="display">No votes cast yet</h2>
            <p className="subtext">Results will appear here once voting begins.</p>
          </div>
        )}
      </div>

      <div className="section-title">Election overview</div>
      <div className="stat-grid">
        <div className="stat-box"><div className="num">{totalCandidates}</div><div className="label">Registered candidates</div></div>
        <div className="stat-box"><div className="num">{totalVoters}</div><div className="label">Registered voters</div></div>
        <div className="stat-box"><div className="num">{totalVoted}</div><div className="label">Votes cast</div></div>
        <div className="stat-box"><div className="num">{totalVoters - totalVoted}</div><div className="label">Not yet voted</div></div>
      </div>

      <div className="stub-card">
        <h2 className="display" style={{ fontSize: 18 }}>Votes per candidate</h2>
        {candidates.length === 0 ? (
          <p className="subtext">No candidates registered yet.</p>
        ) : (
          <table className="data-table">
            <thead><tr><th>Candidate</th><th>Symbol</th><th>Votes</th></tr></thead>
            <tbody>
              {sorted.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className="symbol-box">{c.symbol}</span></td>
                  <td>{c.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
