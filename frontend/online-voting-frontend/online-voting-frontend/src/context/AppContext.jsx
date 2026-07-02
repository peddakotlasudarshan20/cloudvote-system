import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'

const AppContext = createContext(null)
const STORAGE_KEY = 'ovs_data_v1'

function loadInitialData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try { return JSON.parse(raw) } catch { /* fall through */ }
  }
  return {
    admin: { username: 'admin', password: 'admin123' },
    election: { date: '', startTime: '', endTime: '' },
    candidates: [],
    voters: []   // { email, name, hasVoted }
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadInitialData)
  const [supabaseUser, setSupabaseUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Admin session stays local
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ovs_admin')) === true } catch { return false }
  })

  // Persist app data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Persist admin session
  useEffect(() => {
    sessionStorage.setItem('ovs_admin', JSON.stringify(isAdmin))
  }, [isAdmin])

  // Sync Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null
      setSupabaseUser(user)
      if (user) ensureVoterExists(user.email)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setSupabaseUser(user)
      if (user) ensureVoterExists(user.email)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Auto-register voter on first login
  function ensureVoterExists(email) {
    setData(prev => {
      if (prev.voters.some(v => v.email === email)) return prev
      return { ...prev, voters: [...prev.voters, { email, name: email.split('@')[0], hasVoted: false }] }
    })
  }

  // ---------- Election window ----------
  function isElectionOpen() {
    const { date, startTime, endTime } = data.election
    if (!date || !startTime || !endTime) return true
    const now = new Date()
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    return now >= start && now <= end
  }

  // ---------- Voter actions ----------
  function getCurrentVoter() {
    if (!supabaseUser) return null
    return data.voters.find(v => v.email === supabaseUser.email) || null
  }

  async function logoutVoter() {
    await supabase.auth.signOut()
    setSupabaseUser(null)
  }

  function castVote(candidateId) {
    const voter = getCurrentVoter()
    if (!voter) return { ok: false, message: 'You must log in first.' }
    if (voter.hasVoted) return { ok: false, message: 'You have already voted. Each voter may vote only once.' }
    if (!isElectionOpen()) return { ok: false, message: 'Voting is not open right now. Check the election schedule.' }
    setData(prev => ({
      ...prev,
      voters: prev.voters.map(v => v.email === voter.email ? { ...v, hasVoted: true } : v),
      candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
    }))
    return { ok: true }
  }

  // ---------- Admin actions ----------
  function loginAdmin(username, password) {
    if (data.admin.username === username.trim() && data.admin.password === password) {
      setIsAdmin(true)
      return { ok: true }
    }
    return { ok: false, message: 'Invalid admin credentials.' }
  }

  function logoutAdmin() { setIsAdmin(false) }

  function adminAddCandidate(name, symbol, party, partyLogo, bio, photoUrl, partyLogoUrl) {
    if (!name.trim()) return { ok: false, message: 'Candidate name is required.' }
    const id = 'c_' + Date.now()
    setData(prev => ({
      ...prev,
      candidates: [...prev.candidates, {
        id,
        name: name.trim(),
        symbol: symbol?.trim() || '—',
        party: (party || '').trim(),
        partyLogo: (partyLogo || '').trim(),
        bio: (bio || '').trim(),
        photoUrl: photoUrl || '',
        partyLogoUrl: partyLogoUrl || '',
        votes: 0
      }]
    }))
    return { ok: true }
  }

  function adminRemoveCandidate(id) {
    setData(prev => ({ ...prev, candidates: prev.candidates.filter(c => c.id !== id) }))
  }

  function adminAddVoter(email, name) {
    if (!email.trim()) return { ok: false, message: 'Email is required.' }
    if (data.voters.some(v => v.email === email.trim())) {
      return { ok: false, message: 'This email is already registered.' }
    }
    setData(prev => ({ ...prev, voters: [...prev.voters, { email: email.trim(), name: name?.trim() || email.split('@')[0], hasVoted: false }] }))
    return { ok: true }
  }

  function adminRemoveVoter(email) {
    setData(prev => ({ ...prev, voters: prev.voters.filter(v => v.email !== email) }))
  }

  function setElectionSchedule(date, startTime, endTime) {
    setData(prev => ({ ...prev, election: { date, startTime, endTime } }))
  }

  const value = {
    data, supabaseUser, authLoading, isAdmin,
    isElectionOpen,
    getCurrentVoter, logoutVoter, castVote,
    loginAdmin, logoutAdmin,
    adminAddCandidate, adminRemoveCandidate,
    adminAddVoter, adminRemoveVoter,
    setElectionSchedule
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
