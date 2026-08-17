import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import { useUserLanguage, getText } from '../utils/language'
import './Auth.css'

function Signup() {
  const [role, setRole] = useState('buyer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const userLanguage = useUserLanguage()

  const text = getText({
    English: {
      fillFields: 'Please fill in all fields.',
      passMismatch: 'Passwords do not match.',
      passMin: 'Password must be at least 6 characters.',
      signupFailed: 'Signup failed',
      serverError: 'Server error. Make sure backend is running.',
      title: 'Create Account 🚀',
      subtitle: "Join as a Buyer or Seller - it's free!",
      heroTitle: 'Start Your Journey With Us',
      heroSub: 'Create your free account and get access to thousands of verified car listings across India.',
      listedCars: 'Cars Listed',
      happyUsers: 'Happy Users',
      cities: 'Cities',
      buyCar: 'Buy a Car',
      sellCar: 'Sell a Car',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      creating: 'Creating account...',
      signUpAs: 'Sign Up as',
      buyer: 'Buyer',
      seller: 'Seller',
      haveAccount: 'Already have an account?',
      login: 'Login'
    },
    Hindi: {
      fillFields: 'कृपया सभी फील्ड भरें।',
      passMismatch: 'पासवर्ड मेल नहीं खाते।',
      passMin: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      signupFailed: 'साइनअप विफल हुआ',
      serverError: 'सर्वर त्रुटि। सुनिश्चित करें कि बैकएंड चल रहा है।',
      title: 'अकाउंट बनाएं 🚀',
      subtitle: 'खरीदार या विक्रेता के रूप में जुड़ें - यह मुफ्त है!',
      heroTitle: 'हमारे साथ अपनी यात्रा शुरू करें',
      heroSub: 'मुफ्त अकाउंट बनाएं और भारत भर की हजारों सत्यापित कार लिस्टिंग तक पहुंच पाएं।',
      listedCars: 'लिस्टेड कारें',
      happyUsers: 'खुश यूजर्स',
      cities: 'शहर',
      buyCar: 'कार खरीदें',
      sellCar: 'कार बेचें',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      creating: 'अकाउंट बन रहा है...',
      signUpAs: 'साइन अप करें',
      buyer: 'खरीदार',
      seller: 'विक्रेता',
      haveAccount: 'क्या आपका अकाउंट पहले से है?',
      login: 'लॉगिन'
    }
  }, userLanguage)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError(text.fillFields)
      return
    }
    if (password !== confirmPassword) {
      setError(text.passMismatch)
      return
    }
    if (password.length < 6) {
      setError(text.passMin)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || text.signupFailed)
        setLoading(false)
        return
      }

      localStorage.setItem('userRole', role)
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userName', name)

      if (role === 'buyer') navigate('/buyer-home')
      else navigate('/seller-home')
    } catch (err) {
      setError(text.serverError)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left Visual Panel */}
      <div className="auth-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="visual-logo">
            <div className="logo-box">C</div>
            <span>CarWale</span>
          </div>
          <h2>{text.heroTitle}</h2>
          <p>{text.heroSub}</p>
          <div className="visual-stats">
            <div className="v-stat"><span>50K+</span><small>{text.listedCars}</small></div>
            <div className="v-stat"><span>10K+</span><small>{text.happyUsers}</small></div>
            <div className="v-stat"><span>100+</span><small>{text.cities}</small></div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-box">
          <h2 className="auth-title">{text.title}</h2>
          <p className="auth-subtitle">{text.subtitle}</p>

          {/* Role Tabs */}
          <div className="role-tabs">
            <button className={`role-tab ${role === 'buyer' ? 'active' : ''}`} onClick={() => setRole('buyer')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span>{text.buyCar}</span>
            </button>
            <button className={`role-tab ${role === 'seller' ? 'active' : ''}`} onClick={() => setRole('seller')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              <span>{text.sellCar}</span>
            </button>
          </div>

          {error && <div className="error-msg"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{text.fullName}</label>
              <div className="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>{text.email}</label>
              <div className="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{text.password}</label>
                <div className="input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>{text.confirmPassword}</label>
                <div className="input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? text.creating : `${text.signUpAs} ${role === 'buyer' ? text.buyer : text.seller}`}
            </button>
          </form>

          <p className="auth-switch">
            {text.haveAccount} <a onClick={() => navigate('/login')}>{text.login}</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
