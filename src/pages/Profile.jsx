import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole') || 'buyer'
  const email = localStorage.getItem('userEmail') || ''
  const userLanguage = useUserLanguage()

  const text = getText({
    English: {
      saveOk: '✅ Profile saved successfully!',
      saveFail: 'Failed to save profile',
      fillPasswords: 'Please fill both password fields.',
      passMin: 'New password must be at least 6 characters.',
      wrongCurrent: 'Current password is incorrect.',
      passChanged: '✅ Password changed successfully!',
      serverErr: 'Server error.',
      user: 'User',
      sellerAccount: 'Seller Account',
      buyerAccount: 'Buyer Account',
      personalInfo: 'Personal Info',
      security: 'Security',
      dashboard: 'Dashboard',
      memberSince: 'Member since',
      logout: 'Log Out',
      listedCars: 'Listed Cars',
      sold: 'Sold',
      totalViews: 'Total Views',
      wishlist: 'Wishlist',
      enquiries: 'Enquiries',
      testDrives: 'Test Drives',
      personalTitle: 'Personal Information',
      personalSub: 'Update your personal details here',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      emailLock: '🔒 Email cannot be changed',
      phone: 'Phone Number',
      city: 'City',
      saveChanges: 'Save Changes',
      securityTitle: 'Security Settings',
      securitySub: 'Manage your password and account security',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      updatePassword: 'Update Password',
      accDashboard: 'Account Dashboard',
      accSub: 'Your activity overview at a glance',
      accType: 'Account Type',
      seller: '🚗 Seller',
      buyer: '🛒 Buyer',
      emailVerified: 'Email Verified',
      verified: '✅ Verified',
      location: 'Location',
      notSet: 'Not set',
      fullNamePh: 'Enter your full name',
      phonePh: '+91 XXXXX XXXXX',
      cityPh: 'e.g. Mumbai',
      currentPassPh: 'Enter current password',
      newPassPh: 'Enter new password'
    },
    Hindi: {
      saveOk: '✅ प्रोफाइल सफलतापूर्वक सेव हो गई!',
      saveFail: 'प्रोफाइल सेव नहीं हो सकी',
      fillPasswords: 'कृपया दोनों पासवर्ड फील्ड भरें।',
      passMin: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      wrongCurrent: 'वर्तमान पासवर्ड गलत है।',
      passChanged: '✅ पासवर्ड सफलतापूर्वक बदल दिया गया!',
      serverErr: 'सर्वर त्रुटि।',
      user: 'यूजर',
      sellerAccount: 'विक्रेता अकाउंट',
      buyerAccount: 'खरीदार अकाउंट',
      personalInfo: 'व्यक्तिगत जानकारी',
      security: 'सुरक्षा',
      dashboard: 'डैशबोर्ड',
      memberSince: 'सदस्यता',
      logout: 'लॉग आउट',
      listedCars: 'लिस्टेड कारें',
      sold: 'बेची गई',
      totalViews: 'कुल व्यू',
      wishlist: 'विशलिस्ट',
      enquiries: 'पूछताछ',
      testDrives: 'टेस्ट ड्राइव',
      personalTitle: 'व्यक्तिगत जानकारी',
      personalSub: 'यहां अपनी व्यक्तिगत जानकारी अपडेट करें',
      fullName: 'पूरा नाम',
      emailAddress: 'ईमेल पता',
      emailLock: '🔒 ईमेल बदला नहीं जा सकता',
      phone: 'फोन नंबर',
      city: 'शहर',
      saveChanges: 'परिवर्तन सहेजें',
      securityTitle: 'सुरक्षा सेटिंग्स',
      securitySub: 'पासवर्ड और अकाउंट सुरक्षा प्रबंधित करें',
      currentPassword: 'वर्तमान पासवर्ड',
      newPassword: 'नया पासवर्ड',
      updatePassword: 'पासवर्ड अपडेट करें',
      accDashboard: 'अकाउंट डैशबोर्ड',
      accSub: 'एक नजर में आपकी गतिविधि',
      accType: 'अकाउंट प्रकार',
      seller: '🚗 विक्रेता',
      buyer: '🛒 खरीदार',
      emailVerified: 'ईमेल सत्यापित',
      verified: '✅ सत्यापित',
      location: 'स्थान',
      notSet: 'सेट नहीं है',
      fullNamePh: 'अपना पूरा नाम दर्ज करें',
      phonePh: '+91 XXXXX XXXXX',
      cityPh: 'जैसे: मुंबई',
      currentPassPh: 'वर्तमान पासवर्ड दर्ज करें',
      newPassPh: 'नया पासवर्ड दर्ज करें'
    }
  }, userLanguage)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [toast, setToast] = useState(null)
  const [activeSection, setActiveSection] = useState('personal')

  // Stats
  const [myCars, setMyCars] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/users/${email}`)
        if (res.ok) {
          const user = await res.json()
          setName(user.name || '')
          setPhone(user.phone || '')
          setCity(user.city || '')
          localStorage.setItem('userName', user.name || '')
          setWishlistCount(user.wishlist ? user.wishlist.length : 0)
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    async function fetchSellerCars() {
      if (role !== 'seller') return
      try {
        const res = await fetch(`${API_URL}/cars/seller/${email}`)
        if (res.ok) {
          const data = await res.json()
          setMyCars(data)
        }
      } catch (err) {
        console.error('Failed to fetch seller cars:', err)
      }
    }

    fetchProfile()
    fetchSellerCars()
  }, [email, role])

  function getInitials(fullName) {
    if (!fullName) return '?'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, city })
      })
      if (res.ok) {
        localStorage.setItem('userName', name)
        setToast({ message: text.saveOk, type: 'success' })
      }
    } catch (err) {
      setToast({ message: text.saveFail, type: 'error' })
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      setToast({ message: text.fillPasswords, type: 'error' })
      return
    }
    if (newPassword.length < 6) {
      setToast({ message: text.passMin, type: 'error' })
      return
    }

    try {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: currentPassword, role })
      })
      if (!loginRes.ok) {
        setToast({ message: text.wrongCurrent, type: 'error' })
        return
      }

      const updateRes = await fetch(`${API_URL}/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })
      if (updateRes.ok) {
        setCurrentPassword('')
        setNewPassword('')
        setToast({ message: text.passChanged, type: 'success' })
      }
    } catch (err) {
      setToast({ message: text.serverErr, type: 'error' })
    }
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  const memberSince = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="profile-page">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="profile-layout">

        {/* LEFT SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <div className="profile-avatar-lg">
              {getInitials(name)}
            </div>
            <h2 className="sidebar-name">{name || text.user}</h2>
            <p className="sidebar-email">{email}</p>
            <span className={`sidebar-badge ${role}`}>
              {role === 'seller' ? text.sellerAccount : text.buyerAccount}
            </span>
          </div>

          <nav className="sidebar-nav">
            <button className={`sidebar-link ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {text.personalInfo}
            </button>
            <button className={`sidebar-link ${activeSection === 'security' ? 'active' : ''}`} onClick={() => setActiveSection('security')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              {text.security}
            </button>
            <button className={`sidebar-link ${activeSection === 'stats' ? 'active' : ''}`} onClick={() => setActiveSection('stats')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              {text.dashboard}
            </button>
          </nav>

          <div className="sidebar-footer">
            <p className="member-since">{text.memberSince} {memberSince}</p>
            <button className="sidebar-logout" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              {text.logout}
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="profile-main">

          {/* Stats Banner */}
          <div className="stats-banner">
            {role === 'seller' ? (
              <>
                <div className="stat-block">
                  <div className="stat-icon-box blue"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>
                  <div><span className="stat-num">{myCars.length}</span><small>{text.listedCars}</small></div>
                </div>
                <div className="stat-block">
                  <div className="stat-icon-box green"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></div>
                  <div><span className="stat-num">{myCars.filter(c => c.status === 'sold').length}</span><small>{text.sold}</small></div>
                </div>
                <div className="stat-block">
                  <div className="stat-icon-box orange"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></div>
                  <div><span className="stat-num">{myCars.reduce((sum, c) => sum + (c.views || 0), 0)}</span><small>{text.totalViews}</small></div>
                </div>
              </>
            ) : (
              <>
                <div className="stat-block">
                  <div className="stat-icon-box red"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
                  <div><span className="stat-num">{wishlistCount}</span><small>{text.wishlist}</small></div>
                </div>
                <div className="stat-block">
                  <div className="stat-icon-box blue"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                  <div><span className="stat-num">0</span><small>{text.enquiries}</small></div>
                </div>
                <div className="stat-block">
                  <div className="stat-icon-box green"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>
                  <div><span className="stat-num">0</span><small>{text.testDrives}</small></div>
                </div>
              </>
            )}
          </div>

          {/* Personal Info Section */}
          {activeSection === 'personal' && (
            <div className="content-card fade-in">
              <div className="card-header">
                <h2>{text.personalTitle}</h2>
                <p>{text.personalSub}</p>
              </div>
              <form onSubmit={handleSaveProfile}>
                <div className="form-grid">
                  <div className="p-form-group">
                    <label>{text.fullName}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={text.fullNamePh} />
                  </div>
                  <div className="p-form-group">
                    <label>{text.emailAddress}</label>
                    <input type="email" value={email} disabled className="disabled" />
                    <span className="field-hint">{text.emailLock}</span>
                  </div>
                  <div className="p-form-group">
                    <label>{text.phone}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={text.phonePh} />
                  </div>
                  <div className="p-form-group">
                    <label>{text.city}</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder={text.cityPh} />
                  </div>
                </div>
                <button type="submit" className="save-btn">{text.saveChanges}</button>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="content-card fade-in">
              <div className="card-header">
                <h2>{text.securityTitle}</h2>
                <p>{text.securitySub}</p>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="form-grid">
                  <div className="p-form-group">
                    <label>{text.currentPassword}</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder={text.currentPassPh} />
                  </div>
                  <div className="p-form-group">
                    <label>{text.newPassword}</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={text.newPassPh} />
                  </div>
                </div>
                <button type="submit" className="save-btn secondary">{text.updatePassword}</button>
              </form>
            </div>
          )}

          {/* Dashboard Section */}
          {activeSection === 'stats' && (
            <div className="content-card fade-in">
              <div className="card-header">
                <h2>{text.accDashboard}</h2>
                <p>{text.accSub}</p>
              </div>
              <div className="dashboard-grid">
                <div className="dash-item">
                  <h4>{text.accType}</h4>
                  <p>{role === 'seller' ? text.seller : text.buyer}</p>
                </div>
                <div className="dash-item">
                  <h4>{text.emailVerified}</h4>
                  <p>{text.verified}</p>
                </div>
                <div className="dash-item">
                  <h4>{text.location}</h4>
                  <p>{city || text.notSet}</p>
                </div>
                <div className="dash-item">
                  <h4>{text.phone}</h4>
                  <p>{phone || text.notSet}</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Profile
