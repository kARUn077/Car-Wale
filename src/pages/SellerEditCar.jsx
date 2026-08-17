import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './SellerAddCar.css'

function SellerEditCar() {
  const navigate = useNavigate()
  const { id } = useParams()
  const sellerEmail = localStorage.getItem('userEmail') || ''
  const userLanguage = useUserLanguage()

  const text = getText({
    English: {
      noPermission: "You don't have permission to edit this car.",
      notFound: 'Car not found.',
      serverError: 'Server error.',
      loading: 'Loading...',
      error: '❌ Error',
      back: '← Back to Dashboard',
      brandReq: 'Brand is required',
      modelReq: 'Model is required',
      yearReq: 'Enter a valid year',
      priceReq: 'Enter a valid price',
      phoneReq: 'Enter a valid 10-digit phone number',
      sellerReq: 'Seller name is required',
      updated: '✅ Car listing updated successfully!',
      updateFail: 'Failed to update car',
      backendErr: 'Server error. Make sure backend is running.',
      title: '✏️ Edit Car Listing',
      sub: 'Update the details of your car listing below.',
      cancel: 'Cancel',
      save: 'Save Changes',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      km: 'Kilometres Driven',
      fuel: 'Fuel Type',
      transmission: 'Transmission',
      price: 'Price (₹)',
      location: 'Location / City',
      sellerName: 'Seller Name',
      phone: 'Phone Number',
      uploadImage: 'Upload Car Image',
      brandPh: 'e.g. Maruti Suzuki',
      modelPh: 'e.g. Swift',
      yearPh: 'e.g. 2021',
      kmPh: 'e.g. 25000',
      pricePh: 'e.g. 500000',
      locationPh: 'e.g. Mumbai',
      sellerPh: 'e.g. John Doe',
      phonePh: 'e.g. 9876543210'
    },
    Hindi: {
      noPermission: 'आपको इस कार को संपादित करने की अनुमति नहीं है।',
      notFound: 'कार नहीं मिली।',
      serverError: 'सर्वर त्रुटि।',
      loading: 'लोड हो रहा है...',
      error: '❌ त्रुटि',
      back: '← डैशबोर्ड पर वापस जाएं',
      brandReq: 'ब्रांड आवश्यक है',
      modelReq: 'मॉडल आवश्यक है',
      yearReq: 'सही वर्ष दर्ज करें',
      priceReq: 'सही कीमत दर्ज करें',
      phoneReq: 'सही 10 अंकों का मोबाइल नंबर दर्ज करें',
      sellerReq: 'विक्रेता का नाम आवश्यक है',
      updated: '✅ कार लिस्टिंग सफलतापूर्वक अपडेट हुई!',
      updateFail: 'कार अपडेट करने में विफल',
      backendErr: 'सर्वर त्रुटि। सुनिश्चित करें कि बैकएंड चल रहा है।',
      title: '✏️ कार लिस्टिंग संपादित करें',
      sub: 'नीचे अपनी कार लिस्टिंग की जानकारी अपडेट करें।',
      cancel: 'रद्द करें',
      save: 'परिवर्तन सहेजें',
      brand: 'ब्रांड',
      model: 'मॉडल',
      year: 'वर्ष',
      km: 'चलाए गए किलोमीटर',
      fuel: 'ईंधन प्रकार',
      transmission: 'ट्रांसमिशन',
      price: 'कीमत (₹)',
      location: 'स्थान / शहर',
      sellerName: 'विक्रेता का नाम',
      phone: 'फोन नंबर',
      uploadImage: 'कार इमेज अपलोड करें',
      brandPh: 'जैसे: मारुति सुजुकी',
      modelPh: 'जैसे: स्विफ्ट',
      yearPh: 'जैसे: 2021',
      kmPh: 'जैसे: 25000',
      pricePh: 'जैसे: 500000',
      locationPh: 'जैसे: मुंबई',
      sellerPh: 'जैसे: जॉन डो',
      phonePh: 'जैसे: 9876543210'
    }
  }, userLanguage)

  const [form, setForm] = useState({
    brand: '', model: '', year: '', km: '',
    fuel: 'Petrol', transmission: 'Manual',
    price: '', location: '', image: '', seller: '', phone: '',
  })
  
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`${API_URL}/cars/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.sellerEmail !== sellerEmail) {
            setFetchError(text.noPermission)
          } else {
            setForm(data)
            setPreview(data.image || '')
          }
        } else {
          setFetchError(text.notFound)
        }
      } catch (err) {
        setFetchError(text.serverError)
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id, sellerEmail, text.noPermission, text.notFound, text.serverError])

  if (loading) {
    return <div className="add-car-page"><Navbar /><div className="add-car-container"><h2>{text.loading}</h2></div></div>
  }

  if (fetchError) {
    return (
      <div className="add-car-page">
        <Navbar />
        <div className="add-car-container">
          <h2>{text.error}</h2>
          <p>{fetchError}</p>
          <button className="cancel-btn" onClick={() => navigate('/seller-home')}>
            {text.back}
          </button>
        </div>
      </div>
    )
  }

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

    try {
      const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        navigate('/seller-home', { state: { toast: text.updated } })
      } else {
        const errData = await res.json()
        setErrors({ server: errData.error || text.updateFail })
      }
    } catch (err) {
      setErrors({ server: text.backendErr })
    }
  }

  return (
    <div className="add-car-page">
      <Navbar />

      <div className="add-car-container">
        <div className="add-car-header">
          <h2>{text.title}</h2>
          <p>{text.sub}</p>
        </div>

        <form className="add-car-form" onSubmit={handleSubmit}>
          {errors.server && <div className="error" style={{marginBottom: '1rem'}}>⚠ {errors.server}</div>}
          {/* Brand + Model */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.brand} <span className="required">*</span></label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder={text.brandPh} />
              {errors.brand && <div className="error">⚠ {errors.brand}</div>}
            </div>
            <div className="form-group">
              <label>{text.model} <span className="required">*</span></label>
              <input name="model" value={form.model} onChange={handleChange} placeholder={text.modelPh} />
              {errors.model && <div className="error">⚠ {errors.model}</div>}
            </div>
          </div>

          {/* Year + KM */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.year} <span className="required">*</span></label>
              <input name="year" type="number" value={form.year} onChange={handleChange}
                placeholder={text.yearPh} min="1980" max={new Date().getFullYear()} />
              {errors.year && <div className="error">⚠ {errors.year}</div>}
            </div>
            <div className="form-group">
              <label>{text.km}</label>
              <input name="km" type="number" value={form.km} onChange={handleChange}
                placeholder={text.kmPh} min="0" />
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
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder={text.pricePh} min="0" />
              {errors.price && <div className="error">⚠ {errors.price}</div>}
            </div>
            <div className="form-group">
              <label>{text.location}</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder={text.locationPh} />
            </div>
          </div>

          {/* Seller details */}
          <div className="form-row">
            <div className="form-group">
              <label>{text.sellerName} <span className="required">*</span></label>
              <input name="seller" value={form.seller} onChange={handleChange} placeholder={text.sellerPh} />
              {errors.seller && <div className="error">⚠ {errors.seller}</div>}
            </div>
            <div className="form-group">
              <label>{text.phone} <span className="required">*</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder={text.phonePh} />
              {errors.phone && <div className="error">⚠ {errors.phone}</div>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>{text.uploadImage}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            {preview && (
              <div className="image-preview" style={{ marginTop: '16px' }}>
                <img src={preview} alt="Car Preview" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/seller-home')}>{text.cancel}</button>
            <button type="submit" className="submit-btn">{text.save}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerEditCar
