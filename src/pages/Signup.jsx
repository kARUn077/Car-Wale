import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

function Signup() {
  const [role, setRole] = useState('buyer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // Save user info to localStorage (later we will use a real backend)
    // Save to users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.find(u => u.email === email)
    if (exists) {
      setError('An account with this email already exists.')
      return
    }

    const newUser = { name, email, password, role }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Also set active user info
    localStorage.setItem('userRole', role)
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name)

    // Redirect based on role
    if (role === 'buyer') {
      navigate('/buyer-home')
    } else {
      navigate('/seller-home')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        {/* Brand Logo */}
        <div className="auth-logo">
          <h1>CarWale</h1>
          <p>Buy & Sell Cars Easily</p>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us as a Buyer or Seller</p>

        {/* Role Selection */}
        <span className="role-select-label">I want to:</span>
        <div className="role-buttons">
          <button
            type="button"
            className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            onClick={() => setRole('buyer')}
          >
            <span className="role-icon">🛒</span>
            Buy a Car
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'seller' ? 'active' : ''}`}
            onClick={() => setRole('seller')}
          >
            <span className="role-icon">🚗</span>
            Sell a Car
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn">
            Sign Up as {role === 'buyer' ? 'Buyer' : 'Seller'}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="auth-switch">
          Already have an account?
          <a onClick={() => navigate('/login')}> Login</a>
        </p>

      </div>
    </div>
  )
}

export default Signup
