import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole') || 'buyer'
  const email = localStorage.getItem('userEmail') || ''

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [saved, setSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  // Load user data
  useEffect(() => {
    const userName = localStorage.getItem('userName') || ''
    const userPhone = localStorage.getItem('userPhone') || ''
    const userCity = localStorage.getItem('userCity') || ''
    setName(userName)
    setPhone(userPhone)
    setCity(userCity)
  }, [])

  // Get initials for avatar
  function getInitials(fullName) {
    if (!fullName) return '?'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }

  // Save profile info
  function handleSaveProfile(e) {
    e.preventDefault()
    localStorage.setItem('userName', name)
    localStorage.setItem('userPhone', phone)
    localStorage.setItem('userCity', city)

    // Also update in the users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex(u => u.email === email)
    if (idx !== -1) {
      users[idx].name = name
      users[idx].phone = phone
      users[idx].city = city
      localStorage.setItem('users', JSON.stringify(users))
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Change password
  function handleChangePassword(e) {
    e.preventDefault()
    setPasswordMsg('')

    if (!currentPassword || !newPassword) {
      setPasswordMsg('Please fill both fields.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters.')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex(u => u.email === email)
    if (idx === -1) {
      setPasswordMsg('User not found.')
      return
    }
    if (users[idx].password !== currentPassword) {
      setPasswordMsg('Current password is incorrect.')
      return
    }

    users[idx].password = newPassword
    localStorage.setItem('users', JSON.stringify(users))
    setCurrentPassword('')
    setNewPassword('')
    setPasswordMsg('✅ Password changed successfully!')
  }

  function handleLogout() {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  // Stats for seller
  const myCars = role === 'seller'
    ? JSON.parse(localStorage.getItem('sellerCars') || '[]').filter(c => c.sellerEmail === email)
    : []

  // Wishlist count for buyer
  const wishlist = role === 'buyer'
    ? JSON.parse(localStorage.getItem('wishlist') || '[]')
    : []

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {getInitials(name)}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{name || 'User'}</h1>
            <p className="profile-email">{email}</p>
            <span className={`profile-badge ${role}`}>
              {role === 'seller' ? '🚗 Seller Account' : '🛒 Buyer Account'}
            </span>
          </div>
        </div>

        <div className="profile-grid">

          {/* Stats Card */}
          <div className="profile-card stats-card">
            <h2 className="card-title">📊 Quick Stats</h2>
            <div className="stats-grid">
              {role === 'seller' ? (
                <>
                  <div className="stat-item">
                    <span className="stat-number">{myCars.length}</span>
                    <span className="stat-label">Listed Cars</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{myCars.filter(c => c.status === 'sold').length}</span>
                    <span className="stat-label">Sold</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{myCars.filter(c => c.status !== 'sold').length}</span>
                    <span className="stat-label">Active</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-item">
                    <span className="stat-number">{wishlist.length}</span>
                    <span className="stat-label">Wishlist</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Enquiries</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Test Drives</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="profile-card">
            <h2 className="card-title">✏️ Personal Information</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="profile-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="profile-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="disabled-input"
                />
                <span className="field-note">🔒 Email cannot be changed</span>
              </div>
              <div className="profile-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="profile-form-group">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              <button type="submit" className="profile-save-btn">
                {saved ? '✅ Saved!' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <h2 className="card-title">🔐 Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="profile-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="profile-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              {passwordMsg && (
                <p className={`password-msg ${passwordMsg.includes('✅') ? 'success' : 'error'}`}>
                  {passwordMsg}
                </p>
              )}
              <button type="submit" className="profile-save-btn secondary">
                🔑 Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="profile-card danger-card">
            <h2 className="card-title">⚠️ Account Actions</h2>
            <p className="danger-text">Log out from your current session.</p>
            <button className="logout-profile-btn" onClick={handleLogout}>
              🚪 Log Out
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
