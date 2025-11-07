import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, UserPlus, LogIn, Pencil, LayoutDashboard, Home as HomeIcon, Sun, Moon } from 'lucide-react';
import './Navbar.css';
import { useState, useEffect } from 'react';

export default function Navbar({ isSidebarOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.nav
        className={`navbar ${isSidebarOpen ? '' : 'closed'}`}
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="navbar__logo">MyCMS</div>

        {user && (
          <div className="navbar__user-info">
            <UserPlus size={20} />
            <span>{user.name || user.username}</span>
          </div>
        )}

        <div className="navbar__links">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
          >
            <HomeIcon size={20} /> <span>Home</span>
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>

          {user && (
            <NavLink
              to="/editor"
              className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
            >
              <Pencil size={20} /> <span>Create Post</span>
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
              >
                <LogIn size={20} /> <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
              >
                <UserPlus size={20} /> <span>Register</span>
              </NavLink>
            </>
          )}

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="navbar__link logout-btn"
              title="Logout"
            >
              <LogOut size={20} /> <span>Logout</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={toggleDarkMode}
          className="navbar__link dark-mode-toggle"
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </motion.nav>
    </>
  );
}
