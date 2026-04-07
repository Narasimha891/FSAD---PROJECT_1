import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import { getUnreadCount } from '../services/notificationService'

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const { addToast } = useToast()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    addToast('Logged out successfully.')
    navigate('/')
  }

  if (!user) return null

  const unread = getUnreadCount(user.id)

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text"><span className="logo-edu">Edu</span><span className="logo-webinar">Webinar</span></span>
        </Link>
      </div>

      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        {role === 'user' && (
          <>
            <Link to="/user/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/user/webinars" onClick={() => setMenuOpen(false)}>Webinars</Link>
            <Link to="/user/calendar" onClick={() => setMenuOpen(false)}>📅 Calendar</Link>
            <Link to="/user/registrations" onClick={() => setMenuOpen(false)}>My Registrations</Link>
            <Link to="/user/saved" onClick={() => setMenuOpen(false)}>🔖 Saved</Link>
            <Link to="/user/progress" onClick={() => setMenuOpen(false)}>📈 Progress</Link>
            <Link to="/user/certificates" onClick={() => setMenuOpen(false)}>🎓 Certs</Link>
            <Link to="/user/forum" onClick={() => setMenuOpen(false)}>💬 Forum</Link>
            <Link to="/user/announcements" onClick={() => setMenuOpen(false)}>
              📢 News {unread > 0 && <span className="notif-badge">{unread}</span>}
            </Link>
            <Link to="/user/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link to="/user/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin/webinars" onClick={() => setMenuOpen(false)}>Webinars</Link>
            <Link to="/admin/registrations" onClick={() => setMenuOpen(false)}>Registrations</Link>
            <Link to="/admin/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link to="/admin/users" onClick={() => setMenuOpen(false)}>Users</Link>
            <Link to="/admin/announcements" onClick={() => setMenuOpen(false)}>📢 Announcements</Link>
          </>
        )}
        <button className="theme-toggle-btn" onClick={toggleTheme} title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  )
}
