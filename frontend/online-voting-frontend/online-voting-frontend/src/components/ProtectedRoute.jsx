import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export function RequireVoter({ children }) {
  const { supabaseUser, authLoading } = useApp()
  if (authLoading) return <div className="page"><p className="subtext" style={{ marginTop: 60 }}>Loading…</p></div>
  if (!supabaseUser) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { isAdmin, authLoading } = useApp()
  if (authLoading) return <div className="page"><p className="subtext" style={{ marginTop: 60 }}>Loading…</p></div>
  if (!isAdmin) return <Navigate to="/admin" replace />
  return children
}
