import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export function RequireVoter({ children }) {
  const { session } = useApp()
  if (!session.voterPin) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { session } = useApp()
  if (!session.isAdmin) return <Navigate to="/admin" replace />
  return children
}
