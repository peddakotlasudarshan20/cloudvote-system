import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { uploadToCloudinary } from '../utils/cloudinary.js'

// ── Reusable image upload field ───────────────────────────────────────────────
function ImageUploadField({ label, id, previewUrl, onUpload, uploading, progress }) {
  const inputRef = useRef()

  async function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    await onUpload(file)
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="img-upload-row">
        {previewUrl
          ? <img src={previewUrl} alt="preview" className="img-upload-preview" />
          : <div className="img-upload-placeholder">📷</div>
        }
        <div className="img-upload-right">
          <button
            type="button"
            className="btn-upload"
            onClick={() => inputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? `Uploading… ${progress}%` : previewUrl ? 'Change image' : 'Upload image'}
          </button>
          {previewUrl && (
            <span className="img-upload-hint">✓ Uploaded to Cloudinary</span>
          )}
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
        </div>
      </div>
      {uploading && (
        <div className="upload-progress-bar">
          <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdministrationPage() {
  const {
    data, logoutAdmin, adminAddCandidate, adminRemoveCandidate,
    adminAddVoter, adminRemoveVoter, setElectionSchedule
  } = useApp()
  const navigate = useNavigate()

  const [candName, setCandName] = useState('')
  const [candSymbol, setCandSymbol] = useState('')
  const [candParty, setCandParty] = useState('')
  const [candPartyLogo, setCandPartyLogo] = useState('')
  const [candBio, setCandBio] = useState('')
  const [candError, setCandError] = useState('')

  // Cloudinary image state
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoProgress, setPhotoProgress] = useState(0)

  const [partyLogoUrl, setPartyLogoUrl] = useState('')
  const [partyLogoUploading, setPartyLogoUploading] = useState(false)
  const [partyLogoProgress, setPartyLogoProgress] = useState(0)

  const [voterName, setVoterName] = useState('')
  const [voterPin, setVoterPin] = useState('')
  const [voterError, setVoterError] = useState('')

  const [date, setDate] = useState(data.election.date)
  const [startTime, setStartTime] = useState(data.election.startTime)
  const [endTime, setEndTime] = useState(data.election.endTime)
  const [scheduleSaved, setScheduleSaved] = useState(false)

  const totalVoters = data.voters.length
  const totalVoted = data.voters.filter(v => v.hasVoted).length

  async function handlePhotoUpload(file) {
    setPhotoUploading(true)
    setPhotoProgress(0)
    try {
      const url = await uploadToCloudinary(file, setPhotoProgress)
      setPhotoUrl(url)
    } catch (err) {
      alert('Photo upload failed: ' + err.message)
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handlePartyLogoUpload(file) {
    setPartyLogoUploading(true)
    setPartyLogoProgress(0)
    try {
      const url = await uploadToCloudinary(file, setPartyLogoProgress)
      setPartyLogoUrl(url)
    } catch (err) {
      alert('Party logo upload failed: ' + err.message)
    } finally {
      setPartyLogoUploading(false)
    }
  }

  function handleAddCandidate(e) {
    e.preventDefault()
    const result = adminAddCandidate(candName, candSymbol, candParty, candPartyLogo, candBio, photoUrl, partyLogoUrl)
    if (!result.ok) { setCandError(result.message); return }
    setCandError('')
    setCandName('')
    setCandSymbol('')
    setCandParty('')
    setCandPartyLogo('')
    setCandBio('')
    setPhotoUrl('')
    setPartyLogoUrl('')
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
      <form className="stub-card" onSubmit={handleAddCandidate} style={{ maxWidth: 480 }}>
        <p className="subtext">Register candidates with their name, party, images, and a short bio.</p>

        <div className="field">
          <label htmlFor="candName">Candidate name</label>
          <input id="candName" value={candName} onChange={e => setCandName(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="candParty">Party name</label>
          <input id="candParty" value={candParty} onChange={e => setCandParty(e.target.value)} placeholder="e.g. National People's Party" />
        </div>

        {/* Candidate photo upload */}
        <ImageUploadField
          label="Candidate photo"
          id="candPhoto"
          previewUrl={photoUrl}
          onUpload={handlePhotoUpload}
          uploading={photoUploading}
          progress={photoProgress}
        />

        {/* Party logo upload */}
        <ImageUploadField
          label="Party logo"
          id="partyLogo"
          previewUrl={partyLogoUrl}
          onUpload={handlePartyLogoUpload}
          uploading={partyLogoUploading}
          progress={partyLogoProgress}
        />

        {/* Fallback emoji fields */}
        <details style={{ marginBottom: 16 }}>
          <summary style={{ fontSize: 12, color: 'var(--slate)', cursor: 'pointer', marginBottom: 8 }}>
            Use emoji instead of images (optional fallback)
          </summary>
          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="candPartyLogo">Party logo emoji</label>
            <input id="candPartyLogo" value={candPartyLogo} onChange={e => setCandPartyLogo(e.target.value)} placeholder="e.g. 🌳 🦁 ⭐" />
          </div>
          <div className="field">
            <label htmlFor="candSymbol">Election symbol</label>
            <input id="candSymbol" value={candSymbol} onChange={e => setCandSymbol(e.target.value)} placeholder="e.g. 🌳 or a short code" />
          </div>
        </details>
        {/* ensure symbol always has a value */}
        {!candSymbol && <input type="hidden" value="—" onChange={() => {}} />}

        <div className="field">
          <label htmlFor="candBio">Candidate bio / details</label>
          <textarea
            id="candBio"
            value={candBio}
            onChange={e => setCandBio(e.target.value)}
            placeholder="Brief background, qualifications, or manifesto points…"
            rows={3}
            style={{
              width: '100%', padding: '11px 12px', border: '1px solid var(--line)',
              borderRadius: 3, fontFamily: 'var(--font-body)', fontSize: 15,
              background: 'var(--paper)', color: 'var(--ink)', resize: 'vertical'
            }}
          />
        </div>

        {candError && <p className="error-text">{candError}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={photoUploading || partyLogoUploading}
          onClick={e => {
            // If symbol is empty, set a default
            if (!candSymbol) setCandSymbol('—')
          }}
        >
          Add candidate
        </button>

        {data.candidates.length > 0 && (
          <table className="data-table" style={{ marginTop: 20 }}>
            <thead>
              <tr><th>Photo</th><th>Name</th><th>Party</th><th>Votes</th><th></th></tr>
            </thead>
            <tbody>
              {data.candidates.map(c => (
                <tr key={c.id}>
                  <td>
                    {c.photoUrl
                      ? <img src={c.photoUrl} alt={c.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
                      : <span className="symbol-box">{c.symbol || '?'}</span>
                    }
                  </td>
                  <td>{c.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--slate)' }}>
                    {c.partyLogoUrl
                      ? <img src={c.partyLogoUrl} alt="" style={{ width: 20, height: 20, objectFit: 'contain', marginRight: 5, verticalAlign: 'middle' }} />
                      : c.partyLogo
                    } {c.party || '—'}
                  </td>
                  <td>{c.votes}</td>
                  <td>
                    <button type="button" className="link-small"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}
                      onClick={() => adminRemoveCandidate(c.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>

      {/* Voter registration */}
      <div className="section-title">Voter registration</div>
      <form className="stub-card" onSubmit={handleAddVoter}>
        <p className="subtext">Pre-register voters by email. Voters can also self-register by logging in via OTP.</p>
        <div className="field">
          <label htmlFor="voterName">Voter name (optional)</label>
          <input id="voterName" value={voterName} onChange={e => setVoterName(e.target.value)} placeholder="Display name" />
        </div>
        <div className="field">
          <label htmlFor="voterPin">Email address</label>
          <input id="voterPin" type="email" value={voterPin} onChange={e => setVoterPin(e.target.value)} placeholder="voter@example.com" required />
        </div>
        {voterError && <p className="error-text">{voterError}</p>}
        <button type="submit" className="btn btn-primary">Add voter</button>

        {data.voters.length > 0 && (
          <table className="data-table" style={{ marginTop: 20 }}>
            <thead><tr><th>Name</th><th>Email</th><th>Voted?</th><th></th></tr></thead>
            <tbody>
              {data.voters.map(v => (
                <tr key={v.email}>
                  <td>{v.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{v.email}</td>
                  <td>{v.hasVoted ? '✓ Yes' : 'No'}</td>
                  <td><button type="button" className="link-small"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}
                    onClick={() => adminRemoveVoter(v.email)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>
    </div>
  )
}
