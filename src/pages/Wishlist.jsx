import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import dummyCars from '../data/carsData'
import Toast from '../components/Toast'
import './Wishlist.css'

function Wishlist() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail') || 'guest'
  const wishlistKey = `wishlist_${userEmail}`

  const [toast, setToast] = useState(null)

  // Get all cars
  const sellerCars = JSON.parse(localStorage.getItem('sellerCars') || '[]')
  const allCars = [...dummyCars, ...sellerCars]

  // Load wishlist IDs
  const [wishlistIds, setWishlistIds] = useState(() => {
    return JSON.parse(localStorage.getItem(wishlistKey) || '[]')
  })

  // Filter to only wishlisted cars
  const wishlistedCars = allCars.filter(car => wishlistIds.includes(String(car.id)))

  function formatPrice(price) {
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' Lakh'
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  function removeFromWishlist(carId) {
    const updated = wishlistIds.filter(id => id !== String(carId))
    setWishlistIds(updated)
    localStorage.setItem(wishlistKey, JSON.stringify(updated))
    setToast({ message: 'Removed from wishlist', type: 'info' })
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
              <div key={car.id} className="wishlist-card">
                <div className="wishlist-card-img-box" onClick={() => navigate(`/car/${car.id}`)}>
                  <img
                    src={car.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image' }}
                  />
                  <button
                    className="remove-wish-btn"
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(car.id) }}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>
                <div className="wishlist-card-info" onClick={() => navigate(`/car/${car.id}`)}>
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
