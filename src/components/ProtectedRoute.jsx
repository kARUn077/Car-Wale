import { Navigate } from 'react-router-dom'

/**
 * Wraps a route and checks:
 * 1. Is user logged in? (userRole exists in localStorage)
 * 2. Does their role match what this route needs? (if role is specified)
 * If not, redirect to login (or their correct home).
 */
function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem('userRole')

  // Not logged in at all
  if (!role) {
    return <Navigate to="/login" replace />
  }

  // Logged in, but wrong role trying to access this route
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'buyer' ? '/buyer-home' : '/seller-home'} replace />
  }

  return children
}

export default ProtectedRoute