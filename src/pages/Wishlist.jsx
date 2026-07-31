import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { API_URL } from '../api'
import './Wishlist.css'

function Wishlist() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail') || 'guest'

  const [toast, setToast] = useState(null)
  const [wishlistedCars, setWishlistedCars] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch user's wishlist (populated with car data)
  useEffect(() => {
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
        setToast({ message: 'Removed from wishlist', type: 'info' })
      }
    } catch (err) {
      setToast({ message: 'Failed to remove', type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-container"><h2>Loading...</h2></div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <Navbar />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>❤️ My Wishlist</h2>
          <p>{wishlistedCars.length} car{wishlistedCars.length !== 1 ? 's' : ''} saved</p>
        </div>

        {wishlistedCars.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">💔</div>
            <h3>Your wishlist is empty</h3>
            <p>Browse cars and click the ❤️ icon to save them here.</p>
            <button className="browse-btn" onClick={() => navigate('/buyer-home')}>
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistedCars.map(car => (
              <div key={car._id} className="wishlist-card">
                <div className="wishlist-card-img-box" onClick={() => navigate(`/car/${car._id}`)}>
                  <img
                    src={car.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image' }}
                  />
                  <button
                    className="remove-wish-btn"
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(car._id) }}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>
                <div className="wishlist-card-info" onClick={() => navigate(`/car/${car._id}`)}>
                  <h3>{car.brand} {car.model}</h3>
                  <p className="wc-meta">{car.year} • {Number(car.km || 0).toLocaleString('en-IN')} km • {car.fuel}</p>
                  <p className="wc-location">📍 {car.location}</p>
                  <div className="wc-bottom">
                    <span className="wc-price">{formatPrice(car.price)}</span>
                    <span className="wc-transmission">{car.transmission}</span>
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
