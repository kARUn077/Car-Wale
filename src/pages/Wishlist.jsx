import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './Wishlist.css'

function Wishlist() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail') || 'guest@carwale.com'
  const userLanguage = useUserLanguage()

  const text = getText({
    English: {
      removed: 'Removed from wishlist',
      removeFail: 'Failed to remove',
      loading: 'Loading your wishlist...',
      title: 'My Wishlist',
      saved: 'saved',
      emptyTitle: 'Your wishlist is empty',
      emptySub: 'Start exploring cars and tap the heart icon to save your favorites here.',
      browseCars: 'Browse Cars',
      removeTitle: 'Remove from wishlist',
      viewDetails: 'View Details'
    },
    Hindi: {
      removed: 'विशलिस्ट से हटाया गया',
      removeFail: 'हटाने में विफल',
      loading: 'आपकी विशलिस्ट लोड हो रही है...',
      title: 'मेरी विशलिस्ट',
      saved: 'सेव',
      emptyTitle: 'आपकी विशलिस्ट खाली है',
      emptySub: 'कारें देखें और पसंदीदा कार सेव करने के लिए हार्ट आइकन दबाएं।',
      browseCars: 'कारें देखें',
      removeTitle: 'विशलिस्ट से हटाएं',
      viewDetails: 'विवरण देखें'
    }
  }, userLanguage)

  const [toast, setToast] = useState(null)
  const [wishlistedCars, setWishlistedCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userEmail === 'guest@carwale.com') {
      setWishlistedCars([])
      setLoading(false)
      return
    }

    async function fetchWishlist() {
      try {
        const res = await fetch(`${API_URL}/users/${userEmail}`)

        if (res.ok) {
          const user = await res.json()
          setWishlistedCars(user.wishlist || [])
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [userEmail])

  function formatPrice(price) {
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' Lakh'
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  async function removeFromWishlist(carId) {
    try {
      const res = await fetch(`${API_URL}/users/${userEmail}/wishlist/${carId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setWishlistedCars(prev => prev.filter(c => c._id !== carId))
        setToast({ message: text.removed, type: 'info' })
      }
    } catch (err) {
      setToast({ message: text.removeFail, type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-container"><div className="wishlist-loading"><div className="loading-spinner"></div><p>{text.loading}</p></div></div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <Navbar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero Banner */}
      <div className="wishlist-hero">
        <div className="wishlist-hero-overlay"></div>
        <div className="wishlist-hero-content">
          <h1>{text.title}</h1>
          <p>{wishlistedCars.length} {userLanguage === 'Hindi' ? 'कार' : `car${wishlistedCars.length !== 1 ? 's' : ''}`} {text.saved}</p>
        </div>
      </div>

      <div className="wishlist-container">
        {wishlistedCars.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-visual">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </div>
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptySub}</p>
            <button className="browse-btn" onClick={() => navigate('/buyer-home')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
              {text.browseCars}
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistedCars.map((car, idx) => (
              <div key={car._id} className="wl-card fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="wl-card-img" onClick={() => navigate(`/car/${car._id}`)}>
                  <img
                    src={car.image || ''}
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => { e.target.src = `https://placehold.co/400x220/1a1a2e/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.model)}` }}
                  />
                  <div className="wl-img-overlay">
                    <span className="wl-fuel-badge">{car.fuel}</span>
                  </div>
                  <button
                    className="wl-remove-btn"
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(car._id) }}
                    title={text.removeTitle}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#e03012" stroke="#e03012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                  </button>
                </div>
                <div className="wl-card-body" onClick={() => navigate(`/car/${car._id}`)}>
                  <h3>{car.brand} {car.model}</h3>
                  <div className="wl-specs">
                    <span>📅 {car.year}</span>
                    <span>🛣️ {Number(car.km || 0).toLocaleString('en-IN')} km</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>
                  <p className="wl-location">📍 {car.location || 'India'}</p>
                  <div className="wl-card-footer">
                    <span className="wl-price">{formatPrice(car.price)}</span>
                    <button className="wl-view-btn" onClick={(e) => { e.stopPropagation(); navigate(`/car/${car._id}`) }}>
                      {text.viewDetails} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
