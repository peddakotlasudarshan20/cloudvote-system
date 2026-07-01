import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)
const STORAGE_KEY = 'ovs_data_v1'
const SESSION_KEY = 'ovs_session_v1'

function loadInitialData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fall through to defaults
    }
  }
  return {
    admin: { username: 'admin', password: 'admin123' },
    election: { date: '', startTime: '', endTime: '' },
    candidates: [],
    voters: []
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadInitialData)
  const [session, setSession] = useState(() => {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : { voterPin: null, isAdmin: false }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  // ---------- Election window helper ----------
  function isElectionOpen() {
    const { date, startTime, endTime } = data.election
    if (!date || !startTime || !endTime) return true // no restriction configured yet
    const now = new Date()
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    return now >= start && now <= end
  }

  // ---------- Voter actions ----------
  function signupVoter(name, pin) {
    if (!name.trim() || !pin.trim()) return { ok: false, message: 'Name and PIN are required.' }
    if (data.voters.some(v => v.pin === pin)) {
      return { ok: false, message: 'This PIN is already registered. Please log in instead.' }
    }
    const newVoter = { pin, name: name.trim(), hasVoted: false }
    setData(prev => ({ ...prev, voters: [...prev.voters, newVoter] }))
    return { ok: true }
  }

  function loginVoter(pin, name) {
    const voter = data.voters.find(v => v.pin === pin && v.name.toLowerCase() === name.trim().toLowerCase())
    if (!voter) return { ok: false, message: 'No matching voter found. Check your PIN and name, or sign up.' }
    setSession(s => ({ ...s, voterPin: pin }))
    return { ok: true }
  }

  function logoutVoter() {
    setSession(s => ({ ...s, voterPin: null }))
  }

  function getCurrentVoter() {
    return data.voters.find(v => v.pin === session.voterPin) || null
  }

  function castVote(candidateId) {
    const voter = getCurrentVoter()
    if (!voter) return { ok: false, message: 'You must log in first.' }
    if (voter.hasVoted) return { ok: false, message: 'You have already voted. Each voter may vote only once.' }
    if (!isElectionOpen()) return { ok: false, message: 'Voting is not open right now. Check the election schedule.' }

    setData(prev => ({
      ...prev,
      voters: prev.voters.map(v => v.pin === voter.pin ? { ...v, hasVoted: true } : v),
      candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
    }))
    return { ok: true }
  }

  // ---------- Admin actions ----------
  function loginAdmin(username, password) {
    if (data.admin.username === username.trim() && data.admin.password === password) {
      setSession(s => ({ ...s, isAdmin: true }))
      return { ok: true }
    }
    return { ok: false, message: 'Invalid admin credentials.' }
  }

  function logoutAdmin() {
    setSession(s => ({ ...s, isAdmin: false }))
  }

  function adminAddCandidate(name, symbol) {
    if (!name.trim() || !symbol.trim()) return { ok: false, message: 'Candidate name and symbol are required.' }
    const id = 'c_' + Date.now()
    setData(prev => ({ ...prev, candidates: [...prev.candidates, { id, name: name.trim(), symbol: symbol.trim(), votes: 0 }] }))
    return { ok: true }
  }

  function adminRemoveCandidate(id) {
    setData(prev => ({ ...prev, candidates: prev.candidates.filter(c => c.id !== id) }))
  }

  function adminAddVoter(name, pin) {
    return signupVoter(name, pin)
  }

  function adminRemoveVoter(pin) {
    setData(prev => ({ ...prev, voters: prev.voters.filter(v => v.pin !== pin) }))
  }

  function setElectionSchedule(date, startTime, endTime) {
    setData(prev => ({ ...prev, election: { date, startTime, endTime } }))
  }

  const value = {
    data,
    session,
    isElectionOpen,
    signupVoter,
    loginVoter,
    logoutVoter,
    getCurrentVoter,
    castVote,
    loginAdmin,
    logoutAdmin,
    adminAddCandidate,
    adminRemoveCandidate,
    adminAddVoter,
    adminRemoveVoter,
    setElectionSchedule
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
