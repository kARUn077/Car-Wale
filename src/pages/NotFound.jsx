import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './CarDetail.css'; // Reusing the not-found styles from CarDetail

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="detail-page">
      <Navbar />
      <div className="not-found" style={{ padding: '140px 20px', textAlign: 'center' }}>
        <div className="not-found-icon" style={{ fontSize: '72px', marginBottom: '24px' }}>😕</div>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-dark)', marginBottom: '12px' }}>
          404 - Page Not Found
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-light)', marginBottom: '32px' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/buyer-home')}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(224,48,18,0.3)'
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
