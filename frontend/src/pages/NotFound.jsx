import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-shell auth-shell">
      <div className="card auth-card text-center">
        <h1>Page not found</h1>
        <p className="muted">The page you requested does not exist.</p>
        <Link to="/dashboard" className="primary-btn inline-link">Return to dashboard</Link>
      </div>
    </div>
  );
}
