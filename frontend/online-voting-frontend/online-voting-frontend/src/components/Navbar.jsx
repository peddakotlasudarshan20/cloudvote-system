import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          CloudVote
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/register">Register</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/results">Results</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;