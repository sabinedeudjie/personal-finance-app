import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Settings,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { C } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/statistics', label: 'Statistiques', icon: BarChart3 },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/settings', label: 'Paramètres', icon: Settings },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Fermer le menu"
          onClick={closeMobile}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <div
            className="sidebar-logo"
            style={{
              background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
              boxShadow: `0 6px 24px ${C.greenGlow}`,
            }}
          >
            <TrendingUp size={18} color="#050A04" strokeWidth={2.5} />
          </div>
          <span className="sidebar-title">Nkapflow</span>
          <button type="button" className="sidebar-close-mobile" onClick={closeMobile} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div
              className="sidebar-avatar"
              style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.green})` }}
            >
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="sidebar-user-name">{user?.name || 'Utilisateur'}</div>
              <div className="sidebar-user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="mobile-topbar">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <span className="mobile-topbar-title">Nkapflow</span>
          <ThemeToggle />
        </header>

        <div className="desktop-topbar">
          <ThemeToggle />
        </div>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
