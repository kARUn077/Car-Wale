import { useEffect } from 'react'
import './Toast.css'

/**
 * Toast notification component
 * Props:
 *   message  — string to display
 *   type     — 'success' | 'error' | 'info'
 *   onClose  — callback when toast closes
 *   duration — ms before auto-close (default 3000)
 */
function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}

export default Toast
