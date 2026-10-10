import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginRequest(form);
      login(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell auth-shell">
      <div className="card auth-card">
        <h1>Welcome back</h1>
        <p className="muted">Sign in to keep your studying on track.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div className="auth-footer">
            Need an account? <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
