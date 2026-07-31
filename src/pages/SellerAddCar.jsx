import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { API_URL } from '../api'
import './SellerAddCar.css'

function SellerAddCar() {
  const navigate = useNavigate()
  const sellerEmail = localStorage.getItem('userEmail') || ''
  const sellerNameStored = localStorage.getItem('userName') || ''

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    km: '',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: '',
    location: '',
    image: '',
    seller: sellerNameStored,
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'image') setPreview(value)
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function validate() {
    const errs = {}
    if (!form.brand.trim()) errs.brand = 'Brand is required'
    if (!form.model.trim()) errs.model = 'Model is required'
    if (!form.year || isNaN(Number(form.year)) || form.year < 1980 || form.year > new Date().getFullYear())
      errs.year = 'Enter a valid year'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Enter a valid price'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid 10-digit phone number'
    if (!form.seller.trim()) errs.seller = 'Seller name is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }

    const newCar = {
      ...form,
      sellerEmail,
    }

    try {
      const res = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
      })

      if (res.ok) {
        navigate('/seller-home', { state: { toast: 'Car listed successfully! 🎉' } })
      } else {
        const errData = await res.json()
        setErrors({ server: errData.error || 'Failed to add car' })
      }
    } catch (err) {
      setErrors({ server: 'Server error. Make sure backend is running.' })
    }
  }

  return (
    <div className="add-car-page">
      <Navbar />

      <div className="add-car-container">
        <div className="add-car-header">
          <h2>📋 Add a Car Listing</h2>
          <p>Fill in the details below to list your car for sale.</p>
        </div>

        <form className="add-car-form" onSubmit={handleSubmit}>
          {errors.server && <div className="error" style={{marginBottom: '1rem'}}>⚠ {errors.server}</div>}
          {/* Brand + Model */}
          <div className="form-row">
            <div className="form-group">
              <label>Brand <span className="required">*</span></label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Maruti Suzuki"
              />
              {errors.brand && <div className="error">⚠ {errors.brand}</div>}
            </div>
            <div className="form-group">
              <label>Model <span className="required">*</span></label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Swift"
              />
              {errors.model && <div className="error">⚠ {errors.model}</div>}
            </div>
          </div>

          {/* Year + KM */}
          <div className="form-row">
            <div className="form-group">
              <label>Year <span className="required">*</span></label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 2021"
                min="1980"
                max={new Date().getFullYear()}
              />
              {errors.year && <div className="error">⚠ {errors.year}</div>}
            </div>
            <div className="form-group">
              <label>Kilometres Driven</label>
              <input
                name="km"
                type="number"
                value={form.km}
                onChange={handleChange}
                placeholder="e.g. 25000"
                min="0"
              />
            </div>
          </div>

          {/* Fuel + Transmission */}
          <div className="form-row">
            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuel" value={form.fuel} onChange={handleChange}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange}>
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>
          </div>

          {/* Price + Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (INR) <span className="required">*</span></label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 650000"
                min="0"
              />
              {errors.price && <div className="error">⚠ {errors.price}</div>}
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          {/* Seller Name + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>Your Name <span className="required">*</span></label>
              <input
                name="seller"
                value={form.seller}
                onChange={handleChange}
                placeholder="Your full name"
              />
              {errors.seller && <div className="error">⚠ {errors.seller}</div>}
            </div>
            <div className="form-group">
              <label>Contact Phone <span className="required">*</span></label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {errors.phone && <div className="error">⚠ {errors.phone}</div>}
            </div>
          </div>

          {/* Image */}
          <div className="form-row">
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            </div>
            <div className="form-group">
              <label>Or Image URL</label>
              <input
                name="image"
                value={form.image.startsWith('data:') ? '' : form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="form-group">
              <label>Preview</label>
              <div className="image-preview">
                <img
                  src={preview}
                  alt="preview"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image' }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">🚗 Add Car Listing</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/seller-home')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerAddCar
