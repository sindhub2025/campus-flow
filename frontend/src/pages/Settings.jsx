import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword, logout } from '../services/authService';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handlePasswordChange(event) {
    event.preventDefault();
    setSuccess('');
    setError('');

    try {
      await changePassword(passwordForm);
      setSuccess('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Unable to update password');
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    window.location.href = '/login';
  }

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Profile</h2>
        <div className="profile-summary">
          <div className="profile-avatar">{(user?.name || 'S').charAt(0).toUpperCase()}</div>
          <div>
            <div className="task-title">{user?.name || 'Student'}</div>
            <div className="task-meta">{user?.email || 'student@campusflow.com'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Security</h2>
        <form className="form" onSubmit={handlePasswordChange}>
          <div className="field">
            <label>Current password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} />
          </div>

          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}

          <button type="submit" className="primary-btn">Update password</button>
        </form>
      </div>

      <div className="card full-span">
        <h2>Account</h2>
        <button type="button" className="primary-btn danger-btn" onClick={handleLogout}>Sign out</button>
      </div>
    </div>
  );
}
