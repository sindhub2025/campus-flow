import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, BookOpenText, CalendarRange, CheckSquare, LayoutDashboard, NotebookText, Settings, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/calendar', label: 'Calendar', icon: CalendarRange },
  { to: '/subjects', label: 'Subjects', icon: BookOpenText },
  { to: '/notes', label: 'Notes', icon: NotebookText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const currentTitle = navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'CampusFlow';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">C</div>
          <div className="brand-name">CampusFlow</div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="user-card">
          <div>
            <div className="user-name">{user?.name || 'Student'}</div>
            <small>{user?.email || 'student@campusflow.com'}</small>
          </div>
          <UserCircle2 size={28} />
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-title">{currentTitle}</div>
          <div className="topbar-actions">
            <input className="search-field" placeholder="Search" aria-label="Search" />
            <button className="icon-button" type="button" aria-label="Notifications">
              <UserCircle2 size={18} />
            </button>
          </div>
        </header>

        <main className="page-shell">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
