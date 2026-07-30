import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const name = localStorage.getItem('userName') || 'User'
  const [open, setOpen] = useState(false)

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  function go(path) {
    setOpen(false)
    navigate(path)
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => go(role === 'seller' ? '/seller-home' : '/buyer-home')}>
        <span className="logo-text">Car<span className="logo-red">Wale</span></span>
      </div>

      {/* Toggle for small screens */}
      <button className="nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
        ☰
      </button>

      {/* Nav Links */}
      <div className={"navbar-links" + (open ? ' open' : '')}>
        {role === 'buyer' && (
          <>
            <a onClick={() => go('/buyer-home')} className="nav-link">🚗 Browse Cars</a>
            <a onClick={() => go('/wishlist')} className="nav-link">❤️ Wishlist</a>
          </>
        )}
        {role === 'seller' && (
          <>
            <a onClick={() => go('/seller-home')} className="nav-link">📋 My Listings</a>
            <a onClick={() => go('/seller-add-car')} className="nav-link nav-link-highlight">+ Add Car</a>
          </>
        )}
      </div>

      {/* Right side - User info + Logout */}
      <div className="navbar-right">
        <span className="nav-username">👤 {name}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
