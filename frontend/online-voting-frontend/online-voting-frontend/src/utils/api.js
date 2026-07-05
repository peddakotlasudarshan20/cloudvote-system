const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://cloudvote-backend-h8in.onrender.com'

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Candidates
  getCandidates:    ()         => request('GET',    '/api/candidates'),
  addCandidate:     (payload)  => request('POST',   '/api/candidates', payload),
  deleteCandidate:  (id)       => request('DELETE', `/api/candidates/${id}`),

  // Voters
  getVoters:        ()         => request('GET',    '/api/voters'),
  registerVoter:    (payload)  => request('POST',   '/api/voters/register', payload),
  deleteVoter:      (email)    => request('DELETE', `/api/voters/${encodeURIComponent(email)}`),
  adminAddVoter:    (payload)  => request('POST',   '/api/admin/voters', payload),

  // Votes
  castVote:         (payload)  => request('POST',   '/api/votes/cast', payload),

  // Results
  getResults:       ()         => request('GET',    '/api/results'),

  // Election schedule
  getElection:      ()         => request('GET',    '/api/election'),
  setElection:      (payload)  => request('POST',   '/api/election', payload),

  // Admin login
  adminLogin:       (payload)  => request('POST',   '/api/admin/login', payload),
}
