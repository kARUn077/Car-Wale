import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import dummyCars from '../data/carsData'
import './CarDetail.css'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

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
          <h2>Car not found 😔</h2>
          <button onClick={() => navigate('/buyer-home')}>Go Back</button>
        </div>
      </div>
    )
  }

  // Format price
  function formatPrice(price) {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + ' Lakh'
    }
    return '₹' + price.toLocaleString('en-IN')
  }

  return (
    <div className="detail-page">
      <Navbar />

      {/* Back Button */}
      <div className="back-btn-row">
        <button className="back-btn" onClick={() => navigate('/buyer-home')}>
          ← Back to Listings
        </button>
      </div>

      <div className="detail-container">

        {/* Left — Car Image */}
        <div className="detail-left">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="detail-img"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x380?text=No+Image' }}
          />

          {/* Tags below image */}
          <div className="detail-tags">
            <span className="tag">{car.fuel}</span>
            <span className="tag">{car.transmission}</span>
            <span className="tag">{car.year}</span>
            <span className="tag">{car.km.toLocaleString('en-IN')} km</span>
          </div>
        </div>

        {/* Right — Car Info */}
        <div className="detail-right">
          <h1 className="detail-title">{car.brand} {car.model}</h1>
          <p className="detail-location">📍 {car.location}</p>
          <p className="detail-price">{formatPrice(car.price)}</p>

          {/* Specs Table */}
          <div className="specs-box">
            <h3>Car Details</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Brand</td>
                  <td>{car.brand}</td>
                </tr>
                <tr>
                  <td>Model</td>
                  <td>{car.model}</td>
                </tr>
                <tr>
                  <td>Year</td>
                  <td>{car.year}</td>
                </tr>
                <tr>
                  <td>Fuel Type</td>
                  <td>{car.fuel}</td>
                </tr>
                <tr>
                  <td>Transmission</td>
                  <td>{car.transmission}</td>
                </tr>
                <tr>
                  <td>Kilometers Driven</td>
                  <td>{car.km.toLocaleString('en-IN')} km</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>{car.location}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Seller Info */}
          <div className="seller-box">
            <h3>Seller Information</h3>
            <p className="seller-name">👤 {car.seller}</p>
            <p className="seller-phone">📞 {car.phone}</p>

            {/* Contact Button */}
            <a
              href={`tel:${car.phone}`}
              className="contact-btn"
            >
              📞 Call Seller
            </a>

            <a
              href={`https://wa.me/91${car.phone}?text=Hi, I am interested in your ${car.brand} ${car.model} listed on CarWale.`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              💬 WhatsApp Seller
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CarDetail
