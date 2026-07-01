# Online Voting System — Frontend (React + Vite)

Frontend for a MERN-stack Online Voting System, matching the wireframes:
Home → Login / Sign up → Voting → Submission → Results, plus Admin login → Administration.

## Pages
- **Home** (`/`) — Welcome screen with **Login** and **Sign up** buttons.
- **Login** (`/login`) — Voter login with PIN + Name.
- **Sign up** (`/signup`) — New voter registration with Name + PIN.
- **Voting** (`/vote`) — Candidate list (name, symbol, single-select vote box), Submit button. Blocks a voter who already voted.
- **Submission** (`/submitted`) — "Vote successfully submitted" confirmation.
- **Results** (`/results`) — Winner banner + total registered candidates, total voters, votes cast per candidate.
- **Admin login** (`/admin`) — Username + password, restricted to authorized admin (default demo: `admin` / `admin123`).
- **Administration** (`/administration`) — Set the voting date/time window, register candidates, register voters, view live stats.

## Current data layer
This build stores data in the browser (`localStorage`/`sessionStorage`) via `src/context/AppContext.jsx`, so the UI and flows are fully testable **before** the Express/MongoDB backend exists. When the backend is ready, replace the functions inside `AppContext.jsx` (`signupVoter`, `loginVoter`, `castVote`, `adminAddCandidate`, etc.) with `fetch`/`axios` calls to your API — the page components don't need to change.

## Run locally
```
npm install
npm run dev
```
Then open the printed local URL (usually `http://localhost:5173`).

## Suggested next steps for the MERN backend
- `POST /api/voters/signup`, `POST /api/voters/login`
- `POST /api/votes` (enforce one-vote-per-voter server-side too — never trust the client alone)
- `POST /api/admin/login` (hash the password, use JWT for the session)
- `POST /api/candidates`, `GET /api/candidates`
- `POST /api/election/schedule`, `GET /api/results`
