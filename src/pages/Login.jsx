import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

function Login() {
  // State for form fields
  const [role, setRole] = useState('buyer') // 'buyer' or 'seller'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    // Check against saved users in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email)
    if (!user) {
      setError('No account found with this email. Please sign up.')
      return
    }

    if (user.password !== password) {
      setError('Invalid email or password.')
      return
    }

    // Login success — store active user info
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('userName', user.name || '')

    // Redirect based on stored role
    if (user.role === 'buyer') navigate('/buyer-home')
    else navigate('/seller-home')
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        {/* Brand Logo */}
        <div className="auth-logo">
          <h1>CarWale</h1>
          <p>Buy & Sell Cars Easily</p>
        </div>

        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Login to your account</p>

        {/* Role Selection */}
        <span className="role-select-label">I am a:</span>
        <div className="role-buttons">
          <button
            type="button"
            className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            onClick={() => setRole('buyer')}
          >
            <span className="role-icon">🛒</span>
            Buyer
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'seller' ? 'active' : ''}`}
            onClick={() => setRole('seller')}
          >
            <span className="role-icon">🚗</span>
            Seller
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn">
            Login as {role === 'buyer' ? 'Buyer' : 'Seller'}
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="auth-switch">
          Don't have an account?
          <a onClick={() => navigate('/signup')}> Sign Up</a>
        </p>

      </div>
    </div>
  )
}

export default Login
