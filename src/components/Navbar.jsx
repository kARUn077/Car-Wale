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
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </span>
                <span>Browse Cars</span>
              </a>
              <a onClick={() => go('/wishlist')} className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </span>
                <span>Wishlist</span>
              </a>
            </>
          )}
          {role === 'seller' && (
            <>
              <a onClick={() => go('/seller-home')} className={`nav-link ${isActive('/seller-home') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
                </span>
                <span>My Listings</span>
              </a>
              <a onClick={() => go('/seller-add-car')} className="nav-link nav-link-cta">
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </span>
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
