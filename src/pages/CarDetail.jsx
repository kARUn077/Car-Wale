import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import dummyCars from '../data/carsData'
import './CarDetail.css'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  // Load seller-added cars from localStorage too
  const sellerCars = JSON.parse(localStorage.getItem('sellerCars') || '[]')
  const allCars = [...dummyCars, ...sellerCars]

  // Find the car by id
  const car = allCars.find(c => String(c.id) === String(id))

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
                <div className="spec-icon">⛽</div>
                <div className="spec-text">
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{car.fuel}</span>
                </div>
              </div>
              <div className="spec-card">
                <div className="spec-icon">⚙️</div>
                <div className="spec-text">
                  <span className="spec-label">Transmission</span>
                  <span className="spec-value">{car.transmission}</span>
                </div>
              </div>
              <div className="spec-card">
                <div className="spec-icon">🛣️</div>
                <div className="spec-text">
                  <span className="spec-label">Kilometers Driven</span>
                  <span className="spec-value">{Number(car.km).toLocaleString('en-IN')} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Seller Profile */}
          <div className="seller-profile-card">
            <div className="seller-header">
              <div className="seller-avatar">
                {car.seller.charAt(0).toUpperCase()}
              </div>
              <div className="seller-details">
                <h3 className="seller-name">
                  {car.seller} 
                  <span className="verified-badge" title="Verified Seller">✅</span>
                </h3>
                <p className="seller-member-since">Member since 2023</p>
              </div>
            </div>
            
            <p className="seller-phone">📞 {car.phone}</p>

            <div className="seller-actions">
              <button className="action-btn contact-btn" onClick={() => setShowContactModal(true)}>
                <span className="btn-icon">📅</span> Schedule Test Drive
              </button>
              <a href={`tel:${car.phone}`} className="action-btn call-btn">
                <span className="btn-icon">📞</span> Call
              </a>
              <a 
                href={`https://wa.me/91${car.phone}?text=Hi, I am interested in your ${car.brand} ${car.model} listed on CarWale.`}
                target="_blank"
                rel="noreferrer"
                className="action-btn whatsapp-btn"
              >
                <span className="btn-icon">💬</span> WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Contact Seller Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Test Drive</h2>
              <button className="close-btn" onClick={() => setShowContactModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-desc">Fill in your details and the seller will contact you to confirm the time.</p>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="Enter your name" defaultValue={localStorage.getItem('userName') || ''} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter mobile number" />
              </div>
              <div className="form-group">
                <label>Preferred Date</label>
                <input type="date" />
              </div>
              <button className="submit-btn" onClick={() => {
                alert("Request Sent Successfully!");
                setShowContactModal(false);
              }}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarDetail
