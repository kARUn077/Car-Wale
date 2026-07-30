import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import './SellerHome.css'

function SellerHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const sellerEmail = localStorage.getItem('userEmail') || ''
  const sellerName = localStorage.getItem('userName') || 'Seller'

  // Toast state
  const [toast, setToast] = useState(null)

  // Load only THIS seller's cars
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('sellerCars')
    const all = saved ? JSON.parse(saved) : []
    return all.filter(c => c.sellerEmail === sellerEmail)
  })

  // Show toast if navigated here with a success message
  useEffect(() => {
    if (location.state?.toast) {
      setToast({ message: location.state.toast, type: 'success' })
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Format price
  function formatPrice(price) {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + ' Lakh'
    }
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  // Delete a car
  function handleDelete(carId) {
    const confirmed = window.confirm('Are you sure you want to delete this listing?')
    if (!confirmed) return

    // Remove from localStorage (all sellers' cars)
    const all = JSON.parse(localStorage.getItem('sellerCars') || '[]')
    const updated = all.filter(c => c.id !== carId)
    localStorage.setItem('sellerCars', JSON.stringify(updated))

    // Update UI state
    setCars(prev => prev.filter(c => c.id !== carId))
    setToast({ message: 'Car listing deleted.', type: 'error' })
  }

  return (
    <div className="seller-page">
      <Navbar />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="seller-header">
        <div>
          <h2>Seller Dashboard</h2>
          <p>Welcome back, <strong>{sellerName}</strong>! Manage your car listings here.</p>
        </div>
        <button className="add-car-btn" onClick={() => navigate('/seller-add-car')}>
          + Add New Car
        </button>
      </div>

      {/* Stats */}
      <div className="seller-stats">
        <div className="stat-box">
          <p className="stat-number">{cars.length}</p>
          <p className="stat-label">Cars Listed</p>
        </div>
        <div className="stat-box">
          <p className="stat-number">
            {cars.length > 0
              ? formatPrice(Math.min(...cars.map(c => Number(c.price))))
              : '—'}
          </p>
          <p className="stat-label">Lowest Price</p>
        </div>
        <div className="stat-box">
          <p className="stat-number">
            {cars.length > 0
              ? formatPrice(Math.max(...cars.map(c => Number(c.price))))
              : '—'}
          </p>
          <p className="stat-label">Highest Price</p>
        </div>
      </div>

      {/* Listings */}
      <div className="seller-listings">
        <p className="listings-title">Your Listed Cars</p>

        {cars.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <p>You have no cars listed yet.</p>
            <button className="add-car-btn" onClick={() => navigate('/seller-add-car')}>
              + Add Your First Car
            </button>
          </div>
        ) : (
          cars.map(car => (
            <div key={car.id} className="seller-car-card">
              {/* Car Image */}
              <img
                src={car.image || 'https://via.placeholder.com/200x140?text=No+Image'}
                alt={`${car.brand} ${car.model}`}
                className="seller-card-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x140?text=No+Image' }}
              />

              {/* Car Info */}
              <div className="seller-card-info">
                <div>
                  <p className="seller-card-title">{car.brand} {car.model}</p>
                  <p className="seller-card-meta">
                    {car.year} • {Number(car.km || 0).toLocaleString('en-IN')} km • {car.fuel} • {car.transmission}
                  </p>
                  <p className="seller-card-meta">📍 {car.location || 'N/A'}</p>
                  {car.phone && <p className="seller-card-meta">📞 {car.phone}</p>}
                </div>
                <p className="seller-card-price">{formatPrice(Number(car.price))}</p>
              </div>

              {/* Actions */}
              <div className="seller-card-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/seller-edit-car/${car.id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(car.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SellerHome
