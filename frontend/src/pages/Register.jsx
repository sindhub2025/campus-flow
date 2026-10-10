import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerRequest(form);
      login(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell auth-shell">
      <div className="card auth-card">
        <h1>Create your account</h1>
        <p className="muted">Build a calmer study routine.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>

          <div className="field">
            <label>Confirm password</label>
            <input type="password" value={form.passwordConfirm} onChange={(event) => setForm({ ...form, passwordConfirm: event.target.value })} />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
