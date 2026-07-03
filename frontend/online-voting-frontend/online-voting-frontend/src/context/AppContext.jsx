import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../utils/supabase.js'
import { api } from '../utils/api.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // ── Auth state (Supabase) ────────────────────────────────────────────────
  const [supabaseUser, setSupabaseUser] = useState(null)
  const [authLoading, setAuthLoading]   = useState(true)

  // ── App data (MongoDB via API) ───────────────────────────────────────────
  const [candidates, setCandidates] = useState([])
  const [voters,     setVoters]     = useState([])
  const [election,   setElection]   = useState({ date: '', startTime: '', endTime: '' })
  const [dataLoading, setDataLoading] = useState(true)

  // ── Admin session (sessionStorage, stays local) ──────────────────────────
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ovs_admin')) === true } catch { return false }
  })

  useEffect(() => {
    sessionStorage.setItem('ovs_admin', JSON.stringify(isAdmin))
  }, [isAdmin])

  // ── Load candidates + election on mount ──────────────────────────────────
  const refreshCandidates = useCallback(async () => {
    try {
      const data = await api.getCandidates()
      setCandidates(data)
    } catch (e) { console.error('getCandidates:', e) }
  }, [])

  const refreshVoters = useCallback(async () => {
    try {
      const data = await api.getVoters()
      setVoters(data)
    } catch (e) { console.error('getVoters:', e) }
  }, [])

  const refreshElection = useCallback(async () => {
    try {
      const data = await api.getElection()
      setElection(data)
    } catch (e) { console.error('getElection:', e) }
  }, [])

  useEffect(() => {
    Promise.all([refreshCandidates(), refreshVoters(), refreshElection()])
      .finally(() => setDataLoading(false))
  }, [refreshCandidates, refreshVoters, refreshElection])

  // ── Supabase auth listener ────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setSupabaseUser(user)
      if (user) {
        // Ensure voter exists in MongoDB (no-op if already registered)
        const name = user.user_metadata?.full_name || ''
        try { await api.registerVoter({ email: user.email, name }) } catch { /* ignore */ }
        await refreshVoters()
      }
      setAuthLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [refreshVoters])

  // ── Election window helper ───────────────────────────────────────────────
  function isElectionOpen() {
    const { date, startTime, endTime } = election
    if (!date || !startTime || !endTime) return true
    const now   = new Date()
    const start = new Date(`${date}T${startTime}`)
    const end   = new Date(`${date}T${endTime}`)
    return now >= start && now <= end
  }

  // ── Voter helpers ────────────────────────────────────────────────────────
  function getCurrentVoter() {
    if (!supabaseUser) return null
    return voters.find(v => v.email === supabaseUser.email) || null
  }

  async function logoutVoter() {
    await supabase.auth.signOut()
    setSupabaseUser(null)
  }

  async function castVote(candidateId) {
    if (!supabaseUser) return { ok: false, message: 'You must log in first.' }
    const voter = getCurrentVoter()
    if (voter?.hasVoted) return { ok: false, message: 'You have already voted. Each voter may vote only once.' }
    if (!isElectionOpen()) return { ok: false, message: 'Voting is not open right now. Check the election schedule.' }

    try {
      await api.castVote({ email: supabaseUser.email, candidateId })
      await Promise.all([refreshCandidates(), refreshVoters()])
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message }
    }
  }

  // ── Admin actions ────────────────────────────────────────────────────────
  async function loginAdmin(username, password) {
    try {
      await api.adminLogin({ username, password })
      setIsAdmin(true)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message || 'Invalid admin credentials.' }
    }
  }

  function logoutAdmin() { setIsAdmin(false) }

  async function adminAddCandidate(name, symbol, party, partyLogo, bio, photoUrl, partyLogoUrl) {
    if (!name.trim()) return { ok: false, message: 'Candidate name is required.' }
    try {
      await api.addCandidate({ name, symbol, party, partyLogo, bio, photoUrl, partyLogoUrl })
      await refreshCandidates()
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message }
    }
  }

  async function adminRemoveCandidate(id) {
    try {
      await api.deleteCandidate(id)
      await refreshCandidates()
    } catch (e) { console.error(e) }
  }

  async function adminAddVoter(email, name) {
    if (!email.trim()) return { ok: false, message: 'Email is required.' }
    try {
      await api.adminAddVoter({ email, name })
      await refreshVoters()
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message }
    }
  }

  async function adminRemoveVoter(email) {
    try {
      await api.deleteVoter(email)
      await refreshVoters()
    } catch (e) { console.error(e) }
  }

  async function setElectionSchedule(date, startTime, endTime) {
    try {
      await api.setElection({ date, startTime, endTime })
      setElection({ date, startTime, endTime })
    } catch (e) { console.error(e) }
  }

  // ── Legacy data shape for pages that still use data.candidates / data.voters
  const data = { candidates, voters, election }

  const value = {
    data, supabaseUser, authLoading, isAdmin, dataLoading,
    isElectionOpen,
    getCurrentVoter, logoutVoter, castVote,
    loginAdmin, logoutAdmin,
    adminAddCandidate, adminRemoveCandidate,
    adminAddVoter, adminRemoveVoter,
    setElectionSchedule,
    refreshCandidates, refreshVoters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
