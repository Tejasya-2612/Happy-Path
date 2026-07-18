import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function AppLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div>
          <p className="eyebrow">Happy Path</p>
          <h1>Tool Library</h1>
        </div>
        <nav>
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/tools">Tools</NavLink>
          <NavLink to="/dashboard/tools/new">Add Tool</NavLink>
        </nav>
        <div className="sidebar-footer">
          <span>{user?.name}</span>
          <button type="button" className="button button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content" tabIndex="-1">
        <Outlet />
      </main>
    </div>
  );
}
