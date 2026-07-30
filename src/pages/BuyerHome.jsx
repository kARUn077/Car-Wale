import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import dummyCars from '../data/carsData'
import Toast from '../components/Toast'
import './BuyerHome.css'

const FUEL_COLORS = {
  Petrol: { bg: '#fff4e5', color: '#e07800', dot: '#f59e0b' },
  Diesel:  { bg: '#eef2ff', color: '#3730a3', dot: '#6366f1' },
  Electric:{ bg: '#ecfdf5', color: '#065f46', dot: '#10b981' },
  Hybrid:  { bg: '#fdf4ff', color: '#6b21a8', dot: '#a855f7' },
}

const QUICK_BUDGETS = [
  { label: 'Under ₹5L', max: 500000 },
  { label: '₹5L–₹10L', min: 500000, max: 1000000 },
  { label: '₹10L–₹15L', min: 1000000, max: 1500000 },
  { label: 'Above ₹15L', min: 1500000 },
]

function BuyerHome() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail') || 'guest'
  const wishlistKey = `wishlist_${userEmail}`

  // ── Filter state ──────────────────────────────────────────
  const [searchText, setSearchText] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedFuel, setSelectedFuel] = useState('All')
  const [selectedTransmission, setSelectedTransmission] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [activeBudget, setActiveBudget] = useState(null)

  // ── Compare state ──────────────────────────────────────────
  const [compareIds, setCompareIds] = useState([])
  const [showCompare, setShowCompare] = useState(false)

  // ── Toast ──────────────────────────────────────────────────
  const [toast, setToast] = useState(null)

  // ── Wishlist state ─────────────────────────────────────────
  const [wishlistIds, setWishlistIds] = useState(() =>
    JSON.parse(localStorage.getItem(wishlistKey) || '[]')
  )

  // ── Data ───────────────────────────────────────────────────
  const sellerCars = JSON.parse(localStorage.getItem('sellerCars') || '[]')
  const allCars = useMemo(() => [...dummyCars, ...sellerCars], [])

  const brands = useMemo(() => ['All', ...new Set(allCars.map(c => c.brand))], [allCars])
  const fuels = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid']
  const transmissions = ['All', 'Manual', 'Automatic']

  // ── Wishlist toggle ────────────────────────────────────────
  function toggleWishlist(e, carId) {
    e.stopPropagation()
    const id = String(carId)
    let updated
    if (wishlistIds.includes(id)) {
      updated = wishlistIds.filter(w => w !== id)
      setToast({ message: 'Removed from wishlist', type: 'info' })
    } else {
      updated = [...wishlistIds, id]
      setToast({ message: '❤️ Added to wishlist!', type: 'success' })
    }
    setWishlistIds(updated)
    localStorage.setItem(wishlistKey, JSON.stringify(updated))
  }

  // ── Compare toggle ─────────────────────────────────────────
  function toggleCompare(e, carId) {
    e.stopPropagation()
    const id = String(carId)
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(i => i !== id))
    } else {
      if (compareIds.length >= 2) {
        setToast({ message: 'Max 2 cars can be compared at once.', type: 'info' })
        return
      }
      setCompareIds(prev => [...prev, id])
      if (compareIds.length === 1) {
        setToast({ message: '✅ 2 cars selected! Click "Compare" to see.', type: 'success' })
      }
    }
  }

  // ── Quick budget chips ─────────────────────────────────────
  function applyBudget(idx) {
    if (activeBudget === idx) {
      setActiveBudget(null); setMinPrice(''); setMaxPrice(''); return
    }
    setActiveBudget(idx)
    const b = QUICK_BUDGETS[idx]
    setMinPrice(b.min ? String(b.min) : '')
    setMaxPrice(b.max ? String(b.max) : '')
  }

  // ── Filtering & sorting ────────────────────────────────────
  const filteredCars = useMemo(() => {
    let cars = allCars.filter(car => {
      const q = searchText.toLowerCase()
      const searchMatch =
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.location || '').toLowerCase().includes(q)

      const brandMatch = selectedBrand === 'All' || car.brand === selectedBrand
      const fuelMatch  = selectedFuel === 'All'  || car.fuel === selectedFuel
      const transMatch = selectedTransmission === 'All' || car.transmission === selectedTransmission

      let budgetMatch = true
      if (minPrice) budgetMatch = budgetMatch && Number(car.price) >= Number(minPrice)
      if (maxPrice) budgetMatch = budgetMatch && Number(car.price) <= Number(maxPrice)

      return searchMatch && brandMatch && fuelMatch && transMatch && budgetMatch
    })

    return [...cars].sort((a, b) => {
      if (sortBy === 'price-asc')  return Number(a.price) - Number(b.price)
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price)
      if (sortBy === 'year-desc')  return Number(b.year)  - Number(a.year)
      if (sortBy === 'year-asc')   return Number(a.year)  - Number(b.year)
      if (sortBy === 'km-asc')     return Number(a.km)    - Number(b.km)
      return 0
    })
  }, [allCars, searchText, selectedBrand, selectedFuel, selectedTransmission, minPrice, maxPrice, sortBy])

  // ── Helpers ────────────────────────────────────────────────
  function formatPrice(price) {
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' Lakh'
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  function resetFilters() {
    setSearchText(''); setSelectedBrand('All'); setSelectedFuel('All')
    setSelectedTransmission('All'); setMinPrice(''); setMaxPrice('')
    setSortBy('default'); setActiveBudget(null)
  }

  // ── Compare cars data ──────────────────────────────────────
  const compareCars = allCars.filter(c => compareIds.includes(String(c.id)))

  return (
    <div className="buyer-page">
      <Navbar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🏆 India's Trusted Car Marketplace</div>
          <h1>Find Your <span className="hero-accent">Dream Car</span></h1>
          <p>Search from hundreds of verified new &amp; used cars across India</p>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by brand, model, city..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button className="search-clear" onClick={() => setSearchText('')}>✕</button>
            )}
            <button className="search-btn">Search</button>
          </div>

          {/* Quick budget chips */}
          <div className="budget-chips">
            {QUICK_BUDGETS.map((b, i) => (
              <button
                key={i}
                className={`budget-chip ${activeBudget === i ? 'active' : ''}`}
                onClick={() => applyBudget(i)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="h-stat"><span>{allCars.length}+</span><p>Cars Listed</p></div>
          <div className="h-stat-divider" />
          <div className="h-stat"><span>6</span><p>Cities</p></div>
          <div className="h-stat-divider" />
          <div className="h-stat"><span>100%</span><p>Verified</p></div>
          <div className="h-stat-divider" />
          <div className="h-stat"><span>Free</span><p>Contact Seller</p></div>
        </div>
      </div>

      {/* ═══════════════ FILTERS ═══════════════ */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-group">
            <label>Brand</label>
            <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Fuel</label>
            <select value={selectedFuel} onChange={e => setSelectedFuel(e.target.value)}>
              {fuels.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Transmission</label>
            <select value={selectedTransmission} onChange={e => setSelectedTransmission(e.target.value)}>
              {transmissions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number" placeholder="e.g. 500000"
              value={minPrice}
              onChange={e => { setMinPrice(e.target.value); setActiveBudget(null) }}
            />
          </div>

          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number" placeholder="e.g. 1500000"
              value={maxPrice}
              onChange={e => { setMaxPrice(e.target.value); setActiveBudget(null) }}
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="km-asc">Lowest KM</option>
            </select>
          </div>

          <button className="reset-btn" onClick={resetFilters}>✕ Reset</button>
        </div>
      </div>

      {/* ═══════════════ RESULTS BAR ═══════════════ */}
      <div className="results-bar">
        <div className="results-left">
          <span className="results-count">{filteredCars.length}</span>
          <span className="results-label">car{filteredCars.length !== 1 ? 's' : ''} found</span>
          {(searchText || selectedBrand !== 'All' || selectedFuel !== 'All' || selectedTransmission !== 'All' || minPrice || maxPrice) && (
            <span className="active-filters-hint">· Filters applied</span>
          )}
        </div>
        <div className="results-right">
          {compareIds.length > 0 && (
            <button className="compare-trigger-btn" onClick={() => setShowCompare(true)}>
              ⚖️ Compare ({compareIds.length}/2)
            </button>
          )}
          {wishlistIds.length > 0 && (
            <button className="wishlist-link" onClick={() => navigate('/wishlist')}>
              ❤️ Wishlist ({wishlistIds.length})
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════ CAR GRID ═══════════════ */}
      <div className="cars-grid">
        {filteredCars.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No cars found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button className="reset-btn-lg" onClick={resetFilters}>Reset All Filters</button>
          </div>
        ) : (
          filteredCars.map(car => {
            const fuelStyle = FUEL_COLORS[car.fuel] || { bg: '#f0f2f5', color: '#555', dot: '#999' }
            const isWished = wishlistIds.includes(String(car.id))
            const isCompared = compareIds.includes(String(car.id))
            const isNew = Number(car.year) >= new Date().getFullYear() - 1

            return (
              <div
                key={car.id}
                className={`car-card ${isCompared ? 'car-card-compared' : ''}`}
                onClick={() => navigate(`/car/${car.id}`)}
              >
                {/* Image box */}
                <div className="card-img-box">
                  <img
                    src={car.image || ''}
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `https://placehold.co/400x220/1a1a2e/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.model)}`
                    }}
                  />

                  {/* Badges */}
                  <div className="card-badges">
                    {isNew && <span className="badge badge-new">NEW</span>}
                    <span className="badge badge-fuel" style={{ background: fuelStyle.bg, color: fuelStyle.color }}>
                      <span className="fuel-dot" style={{ background: fuelStyle.dot }} />
                      {car.fuel}
                    </span>
                  </div>

                  {/* Wishlist heart */}
                  <button
                    className={`heart-btn ${isWished ? 'wishlisted' : ''}`}
                    onClick={(e) => toggleWishlist(e, car.id)}
                    title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    {isWished ? '❤️' : '🤍'}
                  </button>

                  {/* Compare checkbox */}
                  <button
                    className={`compare-btn ${isCompared ? 'compare-active' : ''}`}
                    onClick={(e) => toggleCompare(e, car.id)}
                    title="Add to compare"
                  >
                    {isCompared ? '✅' : '⊕'} Compare
                  </button>
                </div>

                {/* Card body */}
                <div className="card-info">
                  <h3 className="card-title">{car.brand} {car.model}</h3>

                  <div className="card-specs">
                    <span className="spec-item">📅 {car.year}</span>
                    <span className="spec-divider">·</span>
                    <span className="spec-item">🛣️ {Number(car.km || 0).toLocaleString('en-IN')} km</span>
                    <span className="spec-divider">·</span>
                    <span className="spec-item">⚙️ {car.transmission}</span>
                  </div>

                  <p className="card-location">📍 {car.location || 'N/A'}</p>

                  <div className="card-bottom">
                    <span className="card-price">{formatPrice(car.price)}</span>
                    <button
                      className="view-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/car/${car.id}`) }}
                    >
                      View →
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ═══════════════ COMPARE MODAL ═══════════════ */}
      {showCompare && compareCars.length === 2 && (
        <div className="compare-overlay" onClick={() => setShowCompare(false)}>
          <div className="compare-modal" onClick={e => e.stopPropagation()}>
            <div className="compare-modal-header">
              <h2>⚖️ Car Comparison</h2>
              <button className="compare-close" onClick={() => setShowCompare(false)}>✕</button>
            </div>
            <div className="compare-grid">
              {compareCars.map(car => (
                <div key={car.id} className="compare-car-col">
                  <img
                    src={car.image || ''}
                    alt={car.brand}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/300x180/1a1a2e/ffffff?text=${encodeURIComponent(car.brand)}`
                    }}
                  />
                  <h3>{car.brand} {car.model}</h3>
                  <table className="compare-table">
                    <tbody>
                      {[
                        ['Price',        formatPrice(car.price)],
                        ['Year',         car.year],
                        ['Fuel',         car.fuel],
                        ['Transmission', car.transmission],
                        ['KM Driven',    Number(car.km || 0).toLocaleString('en-IN') + ' km'],
                        ['Location',     car.location || 'N/A'],
                        ['Seller',       car.seller || 'N/A'],
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <td className="compare-key">{k}</td>
                          <td className="compare-val">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="view-detail-btn" onClick={() => { setShowCompare(false); navigate(`/car/${car.id}`) }}>
                    View Full Details →
                  </button>
                </div>
              ))}
            </div>
            <div className="compare-modal-footer">
              <button className="clear-compare-btn" onClick={() => { setCompareIds([]); setShowCompare(false) }}>
                Clear Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyerHome
