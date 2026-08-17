import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './SellerAddCar.css'

function SellerAddCar() {
  const navigate = useNavigate()
  const userLanguage = useUserLanguage()
  const sellerEmail = localStorage.getItem('userEmail') || ''
  const sellerNameStored = localStorage.getItem('userName') || ''

  const text = getText({
    English: {
      header: '📋 Add a Car Listing',
      sub: 'Fill in the details below to list your car for sale.',
      brandReq: 'Brand is required',
      modelReq: 'Model is required',
      yearReq: 'Enter a valid year',
      priceReq: 'Enter a valid price',
      phoneReq: 'Enter a valid 10-digit phone number',
      sellerReq: 'Seller name is required',
      listedOk: 'Car listed successfully! 🎉',
      addFail: 'Failed to add car',
      serverErr: 'Server error. Make sure backend is running.',
      submit: '🚗 Add Car Listing',
      cancel: 'Cancel',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      km: 'Kilometres Driven',
      fuel: 'Fuel Type',
      transmission: 'Transmission',
      price: 'Price (INR)',
      location: 'Location',
      yourName: 'Your Name',
      contactPhone: 'Contact Phone',
      uploadImage: 'Upload Image',
      orImageUrl: 'Or Image URL',
      preview: 'Preview',
      brandPh: 'e.g. Maruti Suzuki',
      modelPh: 'e.g. Swift',
      yearPh: 'e.g. 2021',
      kmPh: 'e.g. 25000',
      pricePh: 'e.g. 650000',
      locationPh: 'e.g. Mumbai',
      namePh: 'Your full name',
      phonePh: '10-digit mobile number'
    },
    Hindi: {
      header: '📋 कार लिस्टिंग जोड़ें',
      sub: 'अपनी कार बेचने के लिए नीचे दी गई जानकारी भरें।',
      brandReq: 'ब्रांड आवश्यक है',
      modelReq: 'मॉडल आवश्यक है',
      yearReq: 'सही वर्ष दर्ज करें',
      priceReq: 'सही कीमत दर्ज करें',
      phoneReq: 'सही 10 अंकों का मोबाइल नंबर दर्ज करें',
      sellerReq: 'विक्रेता का नाम आवश्यक है',
      listedOk: 'कार सफलतापूर्वक लिस्ट हो गई! 🎉',
      addFail: 'कार जोड़ने में विफल',
      serverErr: 'सर्वर त्रुटि। सुनिश्चित करें कि बैकएंड चल रहा है।',
      submit: '🚗 कार लिस्टिंग जोड़ें',
      cancel: 'रद्द करें',
      brand: 'ब्रांड',
      model: 'मॉडल',
      year: 'वर्ष',
      km: 'चलाए गए किलोमीटर',
      fuel: 'ईंधन प्रकार',
      transmission: 'ट्रांसमिशन',
      price: 'कीमत (INR)',
      location: 'स्थान',
      yourName: 'आपका नाम',
      contactPhone: 'संपर्क फोन',
      uploadImage: 'इमेज अपलोड करें',
      orImageUrl: 'या इमेज URL',
      preview: 'प्रीव्यू',
      brandPh: 'जैसे: मारुति सुजुकी',
      modelPh: 'जैसे: स्विफ्ट',
      yearPh: 'जैसे: 2021',
      kmPh: 'जैसे: 25000',
      pricePh: 'जैसे: 650000',
      locationPh: 'जैसे: मुंबई',
      namePh: 'अपना पूरा नाम',
      phonePh: '10 अंकों का मोबाइल नंबर'
    }
  }, userLanguage)

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
    if (!form.brand.trim()) errs.brand = text.brandReq
    if (!form.model.trim()) errs.model = text.modelReq
    if (!form.year || isNaN(Number(form.year)) || form.year < 1980 || form.year > new Date().getFullYear())
      errs.year = text.yearReq
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = text.priceReq
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
      errs.phone = text.phoneReq
    if (!form.seller.trim()) errs.seller = text.sellerReq
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
        navigate('/seller-home', { state: { toast: text.listedOk } })
      } else {
        const errData = await res.json()
        setErrors({ server: errData.error || text.addFail })
      }
    } catch (err) {
      setErrors({ server: text.serverErr })
    }
  }

  return (
    <div className="add-car-page">
      <Navbar />

      <div className="add-car-container">
        <div className="add-car-header">
          <h2>{text.header}</h2>
          <p>{text.sub}</p>
        </div>

        <form className="add-car-form" onSubmit={handleSubmit}>
          {errors.server && <div className="error" style={{marginBottom: '1rem'}}>⚠ {errors.server}</div>}
          {/* Brand + Model */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.brand} <span className="required">*</span></label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder={text.brandPh}
              />
              {errors.brand && <div className="error">⚠ {errors.brand}</div>}
            </div>
            <div className="form-group">
              <label>{text.model} <span className="required">*</span></label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder={text.modelPh}
              />
              {errors.model && <div className="error">⚠ {errors.model}</div>}
            </div>
          </div>

          {/* Year + KM */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.year} <span className="required">*</span></label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder={text.yearPh}
                min="1980"
                max={new Date().getFullYear()}
              />
              {errors.year && <div className="error">⚠ {errors.year}</div>}
            </div>
            <div className="form-group">
              <label>{text.km}</label>
              <input
                name="km"
                type="number"
                value={form.km}
                onChange={handleChange}
                placeholder={text.kmPh}
                min="0"
              />
            </div>
          </div>

          {/* Fuel + Transmission */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.fuel}</label>
              <select name="fuel" value={form.fuel} onChange={handleChange}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label>{text.transmission}</label>
              <select name="transmission" value={form.transmission} onChange={handleChange}>
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>
          </div>

          {/* Price + Location */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.price} <span className="required">*</span></label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder={text.pricePh}
                min="0"
              />
              {errors.price && <div className="error">⚠ {errors.price}</div>}
            </div>
            <div className="form-group">
              <label>{text.location}</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder={text.locationPh}
              />
            </div>
          </div>

          {/* Seller Name + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.yourName} <span className="required">*</span></label>
              <input
                name="seller"
                value={form.seller}
                onChange={handleChange}
                placeholder={text.namePh}
              />
              {errors.seller && <div className="error">⚠ {errors.seller}</div>}
            </div>
            <div className="form-group">
              <label>{text.contactPhone} <span className="required">*</span></label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder={text.phonePh}
                maxLength="10"
              />
              {errors.phone && <div className="error">⚠ {errors.phone}</div>}
            </div>
          </div>

          {/* Image */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.uploadImage}</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            </div>
            <div className="form-group">
              <label>{text.orImageUrl}</label>
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
              <label>{text.preview}</label>
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
            <button type="submit" className="submit-btn">{text.submit}</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/seller-home')}>{text.cancel}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerAddCar
