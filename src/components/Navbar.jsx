import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('userRole')
  const name = localStorage.getItem('userName') || 'User'
  const [open, setOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  function go(path) {
    setOpen(false)
    navigate(path)
  }

  function isActive(path) {
    return location.pathname === path
  }

  // Get initials for avatar
  function getInitials(fullName) {
    if (!fullName || fullName === 'User') return '?'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Left - Logo */}
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => go(role === 'seller' ? '/seller-home' : '/buyer-home')}>
            <div className="logo-icon">C</div>
            <span className="logo-text">Car<span className="logo-red">Wale</span></span>
          </div>
        </div>

        {/* Toggle for small screens */}
        <button className="nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          <span className={`hamburger ${open ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Center - Nav Links */}
        <div className={"navbar-center" + (open ? ' open' : '')}>
          {role === 'buyer' && (
            <>
              <a onClick={() => go('/buyer-home')} className={`nav-link ${isActive('/buyer-home') ? 'active' : ''}`}>
                <span className="nav-icon">🚗</span>
                <span>Browse Cars</span>
              </a>
              <a onClick={() => go('/wishlist')} className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}>
                <span className="nav-icon">❤️</span>
                <span>Wishlist</span>
              </a>
            </>
          )}
          {role === 'seller' && (
            <>
              <a onClick={() => go('/seller-home')} className={`nav-link ${isActive('/seller-home') ? 'active' : ''}`}>
                <span className="nav-icon">📋</span>
                <span>My Listings</span>
              </a>
              <a onClick={() => go('/seller-add-car')} className="nav-link nav-link-cta">
                <span>＋</span>
                <span>Add Car</span>
              </a>
            </>
          )}
        </div>

        {/* Right - User actions */}
        <div className="navbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Dark Mode" title="Toggle theme">
            <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
          </button>

          <div className="nav-user-pill" onClick={() => navigate('/profile')}>
            <div className="nav-avatar">{getInitials(name)}</div>
            <span className="nav-user-name">{name}</span>
          </div>

          <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
            <span className="logout-icon">⏻</span>
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
