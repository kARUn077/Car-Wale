import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { API_URL } from '../api'
import './CarDetail.css'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`${API_URL}/cars/${id}`)
        if (res.ok) {
          const data = await res.json()
          setCar(data)
        }
      } catch (err) {
        console.error('Error fetching car:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id])

  // If loading
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="not-found">
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }

  // If car not found
  if (!car) {
    return (
      <div>
        <Navbar />
        <div className="not-found">
          <div className="not-found-icon">😕</div>
          <h2>Car Not Found</h2>
          <p>The car you are looking for might have been sold or removed.</p>
          <button onClick={() => navigate('/buyer-home')}>Explore Other Cars</button>
        </div>
      </div>
    )
  }
  
  // Mock Gallery Images (Using high quality placeholders)
  const galleryImages = [
    car.image,
    `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80`, // generic car 1
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80`, // generic car 2
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80`  // generic car 3
  ]

  // Format price
  function formatPrice(price) {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(2) + ' Lakh'
    }
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  return (
    <div className="detail-page">
      <Navbar />

      {/* Back Button */}
      <div className="back-btn-row">
        <button className="back-btn" onClick={() => navigate('/buyer-home')}>
          <span className="back-arrow">←</span> Back to Listings
        </button>
      </div>

      <div className="detail-container">

        {/* Left — Car Image & Badges */}
        <div className="detail-left">
          <div className="image-wrapper">
            <img
              src={galleryImages[activeImgIdx]}
              alt={`${car.brand} ${car.model}`}
              className="detail-img fade-in"
              key={activeImgIdx}
              onError={(e) => { e.target.src = `https://placehold.co/800x500/1a1a2e/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.model)}` }}
            />
          </div>
          
          <div className="gallery-thumbnails">
            {galleryImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                className={`thumbnail ${activeImgIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIdx(idx)}
                alt="thumbnail"
              />
            ))}
          </div>

          {/* Premium Tags below image */}
          <div className="detail-tags">
            <div className="premium-badge fuel-badge">
              <span className="badge-icon">⛽</span>
              {car.fuel}
            </div>
            <div className="premium-badge trans-badge">
              <span className="badge-icon">⚙️</span>
              {car.transmission}
            </div>
            <div className="premium-badge year-badge">
              <span className="badge-icon">📅</span>
              {car.year}
            </div>
            <div className="premium-badge km-badge">
              <span className="badge-icon">🛣️</span>
              {Number(car.km).toLocaleString('en-IN')} km
            </div>
          </div>
        </div>

        {/* Right — Car Info (Sticky) */}
        <div className="detail-right">
          
          {/* Header Info */}
          <div className="info-header-card">
            <div className="title-row">
              <h1 className="detail-title">{car.brand} {car.model}</h1>
              <div className="title-divider"></div>
              <p className="detail-location">📍 {car.location}</p>
            </div>
            <div className="price-row">
              <p className="detail-price">{formatPrice(car.price)}</p>
              <span className="emi-hint">EMI starts @ ₹{(car.price / 60).toFixed(0)}/mo</span>
            </div>
          </div>

          {/* Grid Specs */}
          <div className="specs-box">
            <h3>Car Overview</h3>
            <div className="specs-grid">
              <div className="spec-card">
                <div className="spec-icon">🏷️</div>
                <div className="spec-text">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">{car.brand}</span>
                </div>
              </div>
              <div className="spec-card">
                <div className="spec-icon">🚘</div>
                <div className="spec-text">
                  <span className="spec-label">Model</span>
                  <span className="spec-value">{car.model}</span>
                </div>
              </div>
              <div className="spec-card">
                <div className="spec-icon">📅</div>
                <div className="spec-text">
                  <span className="spec-label">Registration Year</span>
                  <span className="spec-value">{car.year}</span>
                </div>
              </div>
              <div className="spec-card">
                <div className="spec-icon">📍</div>
                <div className="spec-text">
                  <span className="spec-label">Location</span>
                  <span className="spec-value">{car.location || 'Not Specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seller / Contact Action */}
          <div className="contact-seller-card">
            <div className="seller-meta">
              <div className="seller-avatar">
                {car.seller ? car.seller.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="seller-details">
                <p className="seller-name">{car.seller || 'Verified Seller'}</p>
                <p className="seller-badge">✓ CarWale Verified Partner</p>
              </div>
            </div>
            
            <button 
              className="primary-contact-btn"
              onClick={() => setShowContactModal(true)}
            >
              📞 Contact Seller
            </button>
            <button 
              className="secondary-testdrive-btn"
              onClick={() => alert("Test Drive feature coming soon!")}
            >
              🚗 Schedule Test Drive
            </button>
          </div>
          
        </div>
      </div>

      {/* Modern Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowContactModal(false)}>
          <div className="modal-content scale-up" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowContactModal(false)}>✕</button>
            
            <div className="modal-header">
              <div className="modal-icon">📞</div>
              <h3>Seller Contact Details</h3>
              <p>Reach out to the seller directly to negotiate.</p>
            </div>

            <div className="contact-info-box">
              <div className="contact-item">
                <span className="contact-label">Name</span>
                <span className="contact-value">{car.seller || 'Verified Seller'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <span className="contact-value highlight-phone">{car.phone || '+91 XXXXX XXXXX'}</span>
              </div>
            </div>
            
            <a href={`tel:${car.phone || ''}`} className="call-now-btn">
              Call Now
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarDetail
