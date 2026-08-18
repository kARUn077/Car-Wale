import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './CarDetail.css'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [car, setCar] = useState(null)
  const [similarCars, setSimilarCars] = useState([])
  const [loading, setLoading] = useState(true)

  // Review state
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null)

  const userName = localStorage.getItem('userName') || 'Guest User'
  const userLanguage = useUserLanguage()
  const text = getText({
    English: {
      loading: 'Loading...',
      notFound: 'Car Not Found',
      notFoundSub: 'The car you are looking for might have been sold or removed.',
      explore: 'Explore Other Cars',
      back: 'Back to Listings',
      expertRating: 'Expert Rating',
      overview: 'Overview',
      highlights: 'Highlights',
      specifications: 'Specifications',
      reviews: 'Reviews',
      faqs: 'FAQs',
      similarCars: 'Similar Cars',
      whyBuy: 'Why Buy',
      topSpec: 'Top-spec Features',
      topSpecSub: 'Fully digital instrument cluster and customizable screens.',
      safety: '5-Star Safety',
      safetySub: 'Equipped with 6 airbags, ABS with EBD, and ESC standard.',
      premium: 'Premium Finish',
      premiumSub: 'Soft-touch materials and premium leatherette upholstery.',
      keySpecs: 'Key Specifications',
      regYear: 'Registration Year',
      kmDriven: 'Kilometers Driven',
      fuelType: 'Fuel Type',
      transmission: 'Transmission',
      engine: 'Engine Capacity',
      seat: 'Seating Capacity',
      estimated: 'Estimated',
      seater: 'Seater',
      userReviews: 'User Reviews',
      basedOn: 'Based on',
      reviewWord: 'review',
      writeReview: 'Write a Review',
      poor: 'Poor',
      fair: 'Fair',
      good: 'Good',
      great: 'Great',
      excellent: 'Excellent',
      selectRating: 'Select rating',
      shareExp: 'Share your experience with this car...',
      reviewOk: '✅ Review submitted successfully!',
      reviewFail: 'Failed to submit review',
      networkErr: 'Network error. Please try again.',
      submitting: 'Submitting...',
      submitReview: 'Submit Review',
      noReviews: 'No reviews yet. Be the first to review this car!',
      faqAbout: 'FAQs About',
      similar: 'Similar Cars',
      priceLabel: 'Price',
      avgPrice: 'Avg. Ex-Showroom price',
      viewBreakup: 'View Price Breakup',
      for5Years: 'For 5 Years',
      emiCalc: 'EMI Calculator',
      offers: 'Contact Seller',
      verifiedPartner: 'CarWale Verified Partner',
      buyingNew: 'Buying a New Car?',
      missedCall: 'Leave a missed call for expert guidance.',
      tollFree: '(Toll Free)',
      sellerContact: 'Seller Contact Details',
      negotiate: 'Reach out to the seller directly to negotiate.',
      name: 'Name',
      phone: 'Phone',
      callNow: 'Call Now',
      recently: 'Recently'
    },
    Hindi: {
      loading: 'लोड हो रहा है...',
      notFound: 'कार नहीं मिली',
      notFoundSub: 'जिस कार को आप खोज रहे हैं वह बिक चुकी है या हटा दी गई है।',
      explore: 'अन्य कारें देखें',
      back: 'लिस्टिंग पर वापस जाएं',
      expertRating: 'एक्सपर्ट रेटिंग',
      overview: 'ओवरव्यू',
      highlights: 'हाइलाइट्स',
      specifications: 'स्पेसिफिकेशन',
      reviews: 'रिव्यू',
      faqs: 'अक्सर पूछे जाने वाले सवाल',
      similarCars: 'मिलती-जुलती कारें',
      whyBuy: 'क्यों खरीदें',
      topSpec: 'टॉप फीचर्स',
      topSpecSub: 'पूरी तरह डिजिटल इंस्ट्रूमेंट क्लस्टर और कस्टमाइज़ेबल स्क्रीन।',
      safety: '5-स्टार सुरक्षा',
      safetySub: '6 एयरबैग, ABS + EBD और ESC से लैस।',
      premium: 'प्रीमियम फिनिश',
      premiumSub: 'सॉफ्ट-टच मटेरियल और प्रीमियम लेदर अपहोल्स्ट्री।',
      keySpecs: 'मुख्य स्पेसिफिकेशन',
      regYear: 'रजिस्ट्रेशन वर्ष',
      kmDriven: 'चलाए गए किलोमीटर',
      fuelType: 'ईंधन प्रकार',
      transmission: 'ट्रांसमिशन',
      engine: 'इंजन क्षमता',
      seat: 'सीटिंग क्षमता',
      estimated: 'अनुमानित',
      seater: 'सीटर',
      userReviews: 'यूजर रिव्यू',
      basedOn: 'आधारित',
      reviewWord: 'रिव्यू',
      writeReview: 'रिव्यू लिखें',
      poor: 'खराब',
      fair: 'औसत',
      good: 'अच्छा',
      great: 'बहुत अच्छा',
      excellent: 'उत्कृष्ट',
      selectRating: 'रेटिंग चुनें',
      shareExp: 'इस कार के साथ अपना अनुभव साझा करें...',
      reviewOk: '✅ रिव्यू सफलतापूर्वक सबमिट हो गया!',
      reviewFail: 'रिव्यू सबमिट नहीं हो सका',
      networkErr: 'नेटवर्क त्रुटि। कृपया फिर से प्रयास करें।',
      submitting: 'सबमिट हो रहा है...',
      submitReview: 'रिव्यू सबमिट करें',
      noReviews: 'अभी कोई रिव्यू नहीं है। पहला रिव्यू आप दें!',
      faqAbout: 'अक्सर पूछे जाने वाले सवाल',
      similar: 'मिलती-जुलती कारें',
      priceLabel: 'कीमत',
      avgPrice: 'औसत एक्स-शोरूम कीमत',
      viewBreakup: 'कीमत का विवरण देखें',
      for5Years: '5 वर्षों के लिए',
      emiCalc: 'EMI कैलकुलेटर',
      offers: 'अगस्त ऑफर देखें',
      verifiedPartner: 'कारवाले सत्यापित पार्टनर',
      buyingNew: 'नई कार खरीद रहे हैं?',
      missedCall: 'विशेषज्ञ मार्गदर्शन के लिए मिस्ड कॉल दें।',
      tollFree: '(टोल फ्री)',
      sellerContact: 'विक्रेता संपर्क विवरण',
      negotiate: 'मोलभाव के लिए सीधे विक्रेता से संपर्क करें।',
      name: 'नाम',
      phone: 'फोन',
      callNow: 'अभी कॉल करें',
      recently: 'हाल ही में'
    }
  }, userLanguage)

  useEffect(() => {
    async function fetchCarData() {
      try {
        const res = await fetch(`${API_URL}/cars/${id}`)
        if (res.ok) {
          const data = await res.json()
          setCar(data)

          // Fetch all cars to get similar ones (mock logic)
          const allRes = await fetch(`${API_URL}/cars`)
          if (allRes.ok) {
            const allData = await allRes.json()
            const similar = allData.filter(c => c._id !== id && (c.brand === data.brand || c.fuel === data.fuel)).slice(0, 3)
            setSimilarCars(similar.length > 0 ? similar : allData.filter(c => c._id !== id).slice(0, 3))
          }
        }
      } catch (err) {
        console.error('Error fetching car:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCarData()
  }, [id])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="not-found"><h2>{text.loading}</h2></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div>
        <Navbar />
        <div className="not-found">
          <div className="not-found-icon"></div>
          <h2>{text.notFound}</h2>
          <p>{text.notFoundSub}</p>
          <button onClick={() => navigate('/buyer-home')}>{text.explore}</button>
        </div>
      </div>
    )
  }

  // Diverse car image pool — each car picks unique images based on its ID hash
  const carImagePool = [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', // red sports car side
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // porsche front
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', // BMW M3 blue
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80', // car interior luxury
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80', // suv white
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80', // dashboard modern
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80', // BMW red front
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', // car showroom
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', // mercedes side
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', // sports car dark
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80', // car rear angle
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80', // vintage car
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', // red ferrari
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // corvette yellow
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', // classic car sunset
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', // white SUV road
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80', // car wheel closeup
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80', // sedan highway
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // lamborghini
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', // audi dark
  ]

  // Simple hash from car ID to pick unique images
  const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }
  const startIdx = hashCode(car._id || id) % (carImagePool.length - 5)
  const galleryImages = [
    car.image,
    carImagePool[startIdx],
    carImagePool[startIdx + 1],
    carImagePool[startIdx + 2],
    carImagePool[startIdx + 3],
  ]

  function formatPrice(price) {
    if (price >= 100000) return '₹' + (price / 100000).toFixed(2) + ' Lakh'
    return '₹' + Number(price).toLocaleString('en-IN')
  }

  const formatReviewDate = (dateValue) => {
    if (!dateValue) return text.recently
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return text.recently
    return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <div className="detail-page">
      <Navbar />

      <div className="back-btn-row">
        <button className="back-btn" onClick={() => navigate('/buyer-home')}>
          <span className="back-arrow">←</span> {text.back}
        </button>
      </div>

      <div className="detail-layout">

        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="detail-main">

          {/* Header */}
          <div className="car-header">
            <h1 className="car-title">{car.brand} {car.model}</h1>
            <p className="car-subtitle">
              <span className="badge-expert">★ 4.8 {text.expertRating}</span>
              <span className="loc-text"> {car.location || 'India'}</span>
            </p>
          </div>

          {/* Sticky Tab Nav */}
          <div className="detail-tabs">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => scrollToSection('overview')}>{text.overview}</button>
            <button className={`tab-btn ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => scrollToSection('highlights')}>{text.highlights}</button>
            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => scrollToSection('specs')}>{text.specifications}</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => scrollToSection('reviews')}>{text.reviews} ({(car.reviews || []).length})</button>
            <button className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => scrollToSection('faqs')}>{text.faqs}</button>
            <button className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`} onClick={() => scrollToSection('similar')}>{text.similarCars}</button>
          </div>

          {/* Image Gallery */}
          <div id="overview" className="gallery-section">
            <div className="main-image-wrapper">
              <img
                src={galleryImages[activeImgIdx]}
                alt={`${car.brand} ${car.model}`}
                className="main-image fade-in"
                key={activeImgIdx}
                onError={(e) => { e.target.src = `https://placehold.co/800x500/1a1a2e/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.model)}` }}
              />
              <div className="gallery-badges">
                <span className="premium-badge fuel-badge"> {car.fuel}</span>
                <span className="premium-badge trans-badge"> {car.transmission}</span>
              </div>
            </div>

            <div className="thumbnail-list">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={`thumbnail-img ${activeImgIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIdx(idx)}
                  alt={`thumbnail-${idx}`}
                />
              ))}
            </div>
          </div>

          {/* Why Buy / Highlights */}
          <div id="highlights" className="section-block">
            <h2 className="section-title">{text.whyBuy} {car.brand} {car.model}?</h2>
            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon"></div>
                <h4>{text.topSpec}</h4>
                <p>{text.topSpecSub}</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon"></div>
                <h4>{text.safety}</h4>
                <p>{text.safetySub}</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon"></div>
                <h4>{text.premium}</h4>
                <p>{text.premiumSub}</p>
              </div>
            </div>
          </div>

          {/* Extended Specifications */}
          <div id="specs" className="section-block">
            <h2 className="section-title">{text.keySpecs}</h2>
            <div className="specs-list">
              <div className="spec-item-row">
                <span className="spec-key">{text.regYear}</span>
                <span className="spec-val">{car.year}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-key">{text.kmDriven}</span>
                <span className="spec-val">{Number(car.km).toLocaleString('en-IN')} km</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-key">{text.fuelType}</span>
                <span className="spec-val">{car.fuel}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-key">{text.transmission}</span>
                <span className="spec-val">{car.transmission}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-key">{text.engine}</span>
                <span className="spec-val">1197 cc ({text.estimated})</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-key">{text.seat}</span>
                <span className="spec-val">5 {text.seater}</span>
              </div>
            </div>
          </div>

          {/* ═══════ REVIEWS SECTION ═══════ */}
          <div id="reviews" className="section-block">
            <h2 className="section-title">{text.userReviews}</h2>

            {/* Average Rating Summary */}
            {(car.reviews || []).length > 0 && (
              <div className="review-summary">
                <div className="review-avg">
                  <span className="avg-number">{((car.reviews || []).reduce((sum, r) => sum + r.rating, 0) / (car.reviews || []).length).toFixed(1)}</span>
                  <div className="avg-stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`star ${s <= Math.round((car.reviews || []).reduce((sum, r) => sum + r.rating, 0) / (car.reviews || []).length) ? 'filled' : ''}`}>★</span>
                    ))}
                  </div>
                  <span className="avg-count">{text.basedOn} {(car.reviews || []).length} {text.reviewWord}{(car.reviews || []).length !== 1 && userLanguage !== 'Hindi' ? 's' : ''}</span>
                </div>
              </div>
            )}

            {/* Write a Review Form */}
            <div className="write-review-box">
              <h3>{text.writeReview}</h3>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map(s => (
                  <span
                    key={s}
                    className={`star-pick ${s <= (reviewHover || reviewRating) ? 'active' : ''}`}
                    onClick={() => setReviewRating(s)}
                    onMouseEnter={() => setReviewHover(s)}
                    onMouseLeave={() => setReviewHover(0)}
                  >★</span>
                ))}
                <span className="rating-text">{reviewRating > 0 ? ['', text.poor, text.fair, text.good, text.great, text.excellent][reviewRating] : text.selectRating}</span>
              </div>
              <textarea
                className="review-textarea"
                placeholder={text.shareExp}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
              <button
                className="submit-review-btn"
                disabled={reviewSubmitting || !reviewRating || !reviewComment.trim()}
                onClick={async () => {
                  setReviewSubmitting(true)
                  try {
                    const reviewPayload = {
                      userName,
                      rating: reviewRating,
                      comment: reviewComment.trim(),
                      createdAt: new Date().toISOString()
                    }

                    const res = await fetch(`${API_URL}/cars/${id}/reviews`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(reviewPayload)
                    })
                    if (res.ok) {
                      const updatedCar = await res.json()
                      setCar(updatedCar)
                      setReviewRating(0)
                      setReviewComment('')
                      setToast({ message: text.reviewOk, type: 'success' })
                    } else if (res.status === 404) {
                      // Fallback for deployments where /:id/reviews route is unavailable.
                      const updatedReviews = [...(car.reviews || []), reviewPayload]
                      const fallbackRes = await fetch(`${API_URL}/cars/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reviews: updatedReviews })
                      })

                      if (fallbackRes.ok) {
                        const fallbackUpdatedCar = await fallbackRes.json()
                        setCar(fallbackUpdatedCar)
                        setReviewRating(0)
                        setReviewComment('')
                        setToast({ message: text.reviewOk, type: 'success' })
                      } else {
                        setToast({ message: text.reviewFail, type: 'error' })
                      }
                    } else {
                      setToast({ message: text.reviewFail, type: 'error' })
                    }
                  } catch (err) {
                    setToast({ message: text.networkErr, type: 'error' })
                  } finally {
                    setReviewSubmitting(false)
                  }
                }}
              >
                {reviewSubmitting ? text.submitting : text.submitReview}
              </button>
            </div>

            {/* Review List */}
            <div className="reviews-list">
              {(car.reviews || []).length === 0 ? (
                <p className="no-reviews">{text.noReviews}</p>
              ) : (
                [...(car.reviews || [])].reverse().map((rev, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-avatar">{rev.userName.charAt(0).toUpperCase()}</div>
                      <div className="reviewer-info">
                        <span className="reviewer-name">{rev.userName}</span>
                        <span className="review-date">{formatReviewDate(rev.createdAt)}</span>
                      </div>
                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} className={`star-sm ${s <= rev.rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ═══════ FAQs SECTION ═══════ */}
          <div id="faqs" className="section-block">
            <h2 className="section-title">{text.faqAbout} {car.brand} {car.model}</h2>
            <div className="faq-list">
              {(userLanguage === 'Hindi' ? [
                { q: `${car.brand} ${car.model} की कीमत क्या है?`, a: `${car.brand} ${car.model} की कीमत ${formatPrice(car.price)} है। यह औसत एक्स-शोरूम कीमत है। आपके शहर और टैक्स के अनुसार ऑन-रोड कीमत बदल सकती है।` },
                { q: `${car.brand} ${car.model} का माइलेज कितना है?`, a: `${car.brand} ${car.model} ${car.fuel} पर चलती है और अनुमानित माइलेज ${car.fuel === 'Electric' ? '350-450 किमी प्रति चार्ज' : car.fuel === 'Diesel' ? '18-22 किमी/लीटर' : '14-18 किमी/लीटर'} देती है।` },
                { q: `क्या ${car.brand} ${car.model} ऑटोमैटिक में उपलब्ध है?`, a: `${car.transmission === 'Automatic' ? `हाँ, यह ${car.brand} ${car.model} ऑटोमैटिक ट्रांसमिशन के साथ आती है।` : `यह ${car.brand} ${car.model} मैनुअल ट्रांसमिशन में है। ऑटोमैटिक वेरिएंट अन्य विक्रेताओं के पास मिल सकते हैं।`}` },
                { q: `यह कार कितने किलोमीटर चली है?`, a: `यह ${car.brand} ${car.model} ${Number(car.km).toLocaleString('en-IN')} किमी चली है। इसका रजिस्ट्रेशन वर्ष ${car.year} है।` },
                { q: `यह कार कहाँ उपलब्ध है?`, a: `यह कार अभी ${car.location || 'भारत'} में उपलब्ध है। टेस्ट ड्राइव या निरीक्षण के लिए विक्रेता से संपर्क करें।` },
              ] : [
                { q: `What is the price of ${car.brand} ${car.model}?`, a: `The ${car.brand} ${car.model} is priced at ${formatPrice(car.price)}. This is the average ex-showroom price. On-road price may vary depending on your city and applicable taxes.` },
                { q: `What is the mileage of ${car.brand} ${car.model}?`, a: `The ${car.brand} ${car.model} runs on ${car.fuel} and offers an estimated mileage of ${car.fuel === 'Electric' ? '350-450 km range per charge' : car.fuel === 'Diesel' ? '18-22 km/l' : '14-18 km/l'} depending on driving conditions.` },
                { q: `Is ${car.brand} ${car.model} available in automatic?`, a: `${car.transmission === 'Automatic' ? `Yes, this ${car.brand} ${car.model} comes with an Automatic transmission.` : `This particular ${car.brand} ${car.model} has a Manual transmission. Automatic variants may be available from other sellers.`}` },
                { q: `How many kilometers has this car been driven?`, a: `This ${car.brand} ${car.model} has been driven ${Number(car.km).toLocaleString('en-IN')} km. It was registered in ${car.year}.` },
                { q: `Where is this car located?`, a: `This car is currently located in ${car.location || 'India'}. You can contact the seller to arrange a test drive or inspection.` },
              ]).map((faq, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <span>Q: {faq.q}</span>
                    <span className="faq-chevron">{openFaq === idx ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Similar Cars */}
          <div id="similar" className="section-block">
            <h2 className="section-title">{text.similar}</h2>
            <div className="similar-cars-grid">
              {similarCars.map(sc => (
                <div key={sc._id} className="similar-car-card" onClick={() => { navigate(`/car/${sc._id}`); window.scrollTo(0, 0) }}>
                  <img
                    src={sc.image || ''}
                    alt={sc.model}
                    onError={(e) => { e.target.src = `https://placehold.co/400x220/1a1a2e/ffffff?text=${sc.brand}` }}
                  />
                  <div className="sim-car-info">
                    <h4>{sc.brand} {sc.model}</h4>
                    <p className="sim-price">{formatPrice(sc.price)}</p>
                    <p className="sim-meta">{sc.year} • {sc.fuel} • {sc.transmission}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - STICKY PRICING / ACTIONS */}
        <div className="detail-sidebar">

          <div className="pricing-card">
            <p className="price-label">{car.brand} {car.model} {text.priceLabel}</p>
            <h2 className="huge-price">{formatPrice(car.price)}</h2>
            <p className="on-road-text">{text.avgPrice} <span className="link-text">{text.viewBreakup}</span></p>

            <div className="emi-box">
              <div className="emi-left">
                <span className="emi-val">EMI ₹{(car.price / 60).toFixed(0)}</span>
                <span className="emi-dur">{text.for5Years}</span>
              </div>
              <button className="calc-btn">{text.emiCalc}</button>
            </div>

            <button className="primary-offer-btn" onClick={() => setShowContactModal(true)}>
              {text.offers}
            </button>

            <div className="seller-card-mini">
              <div className="seller-avatar-mini">{car.seller ? car.seller.charAt(0).toUpperCase() : 'S'}</div>
              <div>
                <p className="s-name">{car.seller || 'Verified Seller'}</p>
                <p className="s-badge">✓ {text.verifiedPartner}</p>
              </div>
            </div>
          </div>

          {/* Promo Card */}
          <div className="promo-banner">
            <div className="promo-content">
              <h4>{text.buyingNew}</h4>
              <p>{text.missedCall}</p>
              <h3>02241357346</h3>
              <small>{text.tollFree}</small>
            </div>
          </div>

        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modern Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowContactModal(false)}>
          <div className="modal-content scale-up" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowContactModal(false)}>✕</button>
            <div className="modal-header">
              <div className="modal-icon">📞</div>
              <h3>{text.sellerContact}</h3>
              <p>{text.negotiate}</p>
            </div>
            <div className="contact-info-box">
              <div className="contact-item">
                <span className="contact-label">{text.name}</span>
                <span className="contact-value">{car.seller || (userLanguage === 'Hindi' ? 'सत्यापित विक्रेता' : 'Verified Seller')}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{text.phone}</span>
                <span className="contact-value highlight-phone">{car.phone || '+91 XXXXX XXXXX'}</span>
              </div>
            </div>
            <a href={`tel:${car.phone || ''}`} className="call-now-btn">{text.callNow}</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarDetail
