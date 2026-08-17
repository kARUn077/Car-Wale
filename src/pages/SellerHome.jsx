import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { API_URL } from "../api";
import "./SellerHome.css";

import {
  FaCar,
  FaPlus,
  FaTrash,
  FaEdit,
  FaHeart,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaGasPump,
  FaCalendarAlt,
  FaTachometerAlt,
  FaCogs,
  FaEye
} from "react-icons/fa";

function SellerHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const sellerEmail = localStorage.getItem('userEmail') || ''
  const sellerName = localStorage.getItem('userName') || 'Seller'

  const [userLanguage, setUserLanguage] = useState(localStorage.getItem('userLanguage') || 'English')
  const [greeting, setGreeting] = useState('Welcome Back')

  const baseText = {
    English: {
      dashboard: 'Seller Dashboard',
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening',
      manage: 'Manage all your listings, update prices, edit information and reach thousands of buyers every day.',
      addListing: 'Add New Listing',
      totalListings: 'Total Listings',
      portfolioValue: 'Portfolio Value',
      saved: 'Saved by Buyers',
      views: 'Total Views',
      activeListings: 'Your Active Listings',
      vehicles: 'vehicles',
      emptyTitle: 'You have no cars listed yet.',
      emptyCta: 'Add Your First Car',
      verify: 'Verified',
      portfolioHealth: 'Portfolio health',
      live: 'Live',
      healthyDemand: 'Healthy demand trend',
      avgPrice: 'Average price',
      avgDesc: 'Pricing is competitive in your current market.',
      highest: 'Highest listing',
      highestDesc: 'Top value in your inventory.',
      lowest: 'Lowest listing',
      lowestDesc: 'Entry-level value to attract buyers.',
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this listing?',
      deleted: 'Car listing deleted.',
      deleteFail: 'Failed to delete car.',
      serverError: 'Server error.',
      na: 'N/A'
    },
    Hindi: {
      dashboard: 'सेलर डैशबोर्ड',
      morning: 'शुभ प्रभात',
      afternoon: 'नमस्कार',
      evening: 'शुभ संध्या',
      manage: 'अपने सभी लिस्टिंग प्रबंधित करें, कीमत अपडेट करें, जानकारी बदलें और हर दिन हजारों खरीदारों तक पहुँचें।',
      addListing: 'नई लिस्टिंग जोड़ें',
      totalListings: 'कुल लिस्टिंग',
      portfolioValue: 'पोर्टफोलियो वैल्यू',
      saved: 'खरीदारों ने सेव किया',
      views: 'कुल व्यू',
      activeListings: 'आपकी सक्रिय लिस्टिंग',
      vehicles: 'वाहन',
      emptyTitle: 'अभी कोई कार लिस्ट नहीं है।',
      emptyCta: 'अपनी पहली कार जोड़ें',
      verify: 'सत्यापित',
      portfolioHealth: 'पोर्टफोलियो स्वास्थ्य',
      live: 'लाइव',
      healthyDemand: 'स्वस्थ मांग ट्रेंड',
      avgPrice: 'औसत कीमत',
      avgDesc: 'आपकी मौजूदा मार्केट में कीमत प्रतिस्पर्धात्मक है।',
      highest: 'सबसे अधिक कीमत',
      highestDesc: 'आपके इन्वेंटरी में सबसे ऊंची वैल्यू।',
      lowest: 'सबसे कम कीमत',
      lowestDesc: 'खरीदारों को आकर्षित करने के लिए एंट्री-लेवल वैल्यू।',
      edit: 'संपादित',
      delete: 'हटाएं',
      deleteConfirm: 'क्या आप यह लिस्टिंग हटाना चाहते हैं?',
      deleted: 'कार लिस्टिंग हटा दी गई।',
      deleteFail: 'कार हटाने में विफल।',
      serverError: 'सर्वर त्रुटि।',
      na: 'उपलब्ध नहीं'
    }
  }

  const text = baseText[userLanguage] || baseText.English

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(userLanguage === 'Hindi' ? 'शुभ प्रभात' : 'Good Morning')
    else if (hour < 18) setGreeting(userLanguage === 'Hindi' ? 'नमस्कार' : 'Good Afternoon')
    else setGreeting(userLanguage === 'Hindi' ? 'शुभ संध्या' : 'Good Evening')
  }, [userLanguage])

  useEffect(() => {
    function handlePrefsChange() {
      setUserLanguage(localStorage.getItem('userLanguage') || 'English')
    }
    window.addEventListener('preferencesChanged', handlePrefsChange)
    return () => window.removeEventListener('preferencesChanged', handlePrefsChange)
  }, [])

  // Toast state
  const [toast, setToast] = useState(null)

  // Load only THIS seller's cars
  const [cars, setCars] = useState([]);

  useEffect(() => {
    async function fetchSellerCars() {
      if (!sellerEmail) return;
      try {
        const res = await fetch(`${API_URL}/cars/seller/${sellerEmail}`);
        if (res.ok) {
          const data = await res.json();
          setCars(data);
        }
      } catch (err) {
        console.error("Failed to fetch seller cars:", err);
      }
    }
    fetchSellerCars();
  }, [sellerEmail]);


  //
  const totalValue = useMemo(() => {
    return cars.reduce((sum, car) => sum + Number(car.price || 0), 0);
  }, [cars]);

  const averagePrice = useMemo(() => {
    if (cars.length === 0) return 0;
    return Math.round(totalValue / cars.length);
  }, [cars, totalValue]);

  const highestPrice = useMemo(() => {
    if (cars.length === 0) return 0;
    return Math.max(...cars.map(car => Number(car.price || 0)));
  }, [cars]);

  const lowestPrice = useMemo(() => {
    if (cars.length === 0) return 0;
    return Math.min(...cars.map(car => Number(car.price || 0)));
  }, [cars]);

  const portfolioHealth = useMemo(() => {
    if (cars.length === 0) return 0;
    const normalized = averagePrice / Math.max(highestPrice, 1);
    return Math.min(100, Math.max(35, Math.round(normalized * 100 + 20)));
  }, [cars.length, averagePrice, highestPrice]);


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
  async function handleDelete(carId) {
    const confirmed = window.confirm(text.deleteConfirm)
    if (!confirmed) return

    try {
      const res = await fetch(`${API_URL}/cars/${carId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setCars(prev => prev.filter(c => c._id !== carId))
        setToast({ message: text.deleted, type: 'error' })
      } else {
        setToast({ message: text.deleteFail, type: 'error' })
      }
    } catch (err) {
      setToast({ message: text.serverError, type: 'error' })
    }
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

     

      <section className="dashboard-banner premium-dashboard-banner fade-in-up">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="banner-left">
            <div className="greeting-badge">✨ {text.dashboard}</div>
            <h1>
              {greeting},
              <span className="seller-name-accent"> {sellerName}</span>
            </h1>
            <p>
              {text.manage}
            </p>
            <button
              className="add-car-btn pulse-anim"
              onClick={() => navigate("/seller-add-car")}
            >
              <FaPlus />
              <span>{text.addListing}</span>
            </button>
          </div>
          <div className="banner-right">
            <FaCar className="banner-car-icon floating-icon" />
          </div>
        </div>
      </section>

      <div className="seller-stats fade-in-up delay-1">
        <div className="stat-box">
          <FaCar className="stat-icon" />
          <p className="stat-number">{cars.length}</p>
          <p className="stat-label">{text.totalListings}</p>
        </div>

        <div className="stat-box">
          <FaMoneyBillWave className="stat-icon" />
          <p className="stat-number">{formatPrice(totalValue)}</p>
          <p className="stat-label">{text.portfolioValue}</p>
        </div>

        <div className="stat-box">
          <FaHeart className="stat-icon" />
          <p className="stat-number">{cars.reduce((sum, car) => sum + (car.wishlistCount || 0), 0)}</p>
          <p className="stat-label">{text.saved}</p>
        </div>

        <div className="stat-box">
          <FaEye className="stat-icon" />
          <p className="stat-number">{cars.reduce((sum, car) => sum + (car.views || 0), 0)}</p>
          <p className="stat-label">{text.views}</p>
        </div>
      </div>

      <section className="seller-insights fade-in-up delay-2">
        <div className="insight-card insight-primary">
          <div className="insight-header">
            <span>{text.portfolioHealth}</span>
            <span className="status-pill">{text.live}</span>
          </div>
          <div className="health-meter">
            <div className="health-fill" style={{ width: `${portfolioHealth}%` }}></div>
          </div>
          <div className="health-row">
            <strong>{portfolioHealth}%</strong>
            <span>{text.healthyDemand}</span>
          </div>
        </div>

        <div className="insight-card">
          <small>{text.avgPrice}</small>
          <strong>{formatPrice(averagePrice)}</strong>
          <p>{text.avgDesc}</p>
        </div>

        <div className="insight-card">
          <small>{text.highest}</small>
          <strong>{formatPrice(highestPrice)}</strong>
          <p>{text.highestDesc}</p>
        </div>

        <div className="insight-card">
          <small>{text.lowest}</small>
          <strong>{formatPrice(lowestPrice || 0)}</strong>
          <p>{text.lowestDesc}</p>
        </div>
      </section>

      {/* Listings */}
      <div className="seller-listings fade-in-up delay-3">
        <div className="listings-header">
          <p className="listings-title">{text.activeListings}</p>
          <span className="listings-count">{cars.length} {text.vehicles}</span>
        </div>

        {cars.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <p>{text.emptyTitle}</p>
            <button className="add-car-btn" onClick={() => navigate('/seller-add-car')}>
              + {text.emptyCta}
            </button>
          </div>
        ) : (
          cars.map(car => (
            <div key={car._id} className="seller-car-card">
              <img
                src={car.image || 'https://via.placeholder.com/200x140?text=No+Image'}
                alt={`${car.brand} ${car.model}`}
                className="seller-card-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x140?text=No+Image' }}
              />

              <div className="seller-card-info">
                <div className="seller-card-heading">
                  <div>
                    <p className="seller-card-title">{car.brand} {car.model}</p>
                    <p className="seller-card-meta">
                      {car.year} • {Number(car.km || 0).toLocaleString('en-IN')} km • {car.fuel} • {car.transmission}
                    </p>
                  </div>
                  <span className="listing-badge">{text.verify}</span>
                </div>

                <div className="seller-card-pills">
                  <span>{car.fuel}</span>
                  <span>{car.transmission}</span>
                  <span>{car.location || text.na}</span>
                </div>

                <div className="seller-card-footer">
                  <div>
                    <p className="seller-card-meta">📍 {car.location || text.na}</p>
                    {car.phone && <p className="seller-card-meta">📞 {car.phone}</p>}
                  </div>
                  <p className="seller-card-price">{formatPrice(Number(car.price))}</p>
                </div>
              </div>

              <div className="seller-card-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/seller-edit-car/${car._id}`)}
                >
                  ✏️ {text.edit}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(car._id)}
                >
                  🗑 {text.delete}
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
