import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUserLanguage, getText } from '../utils/language'
import './CarDetail.css'; // Reusing the not-found styles from CarDetail

function NotFound() {
  const navigate = useNavigate();
  const userLanguage = useUserLanguage()
  const text = getText({
    English: {
      title: '404 - Page Not Found',
      sub: "The page you are looking for doesn't exist or has been moved.",
      cta: 'Go Back Home'
    },
    Hindi: {
      title: '404 - पेज नहीं मिला',
      sub: 'जिस पेज को आप खोज रहे हैं वह मौजूद नहीं है या स्थानांतरित हो गया है।',
      cta: 'होम पर जाएं'
    }
  }, userLanguage)

  return (
    <div className="detail-page">
      <Navbar />
      <div className="not-found">
        <div className="not-found-icon">😕</div>
        <h2>
          {text.title}
        </h2>
        <p>
          {text.sub}
        </p>
        <button 
          className="not-found-btn"
          onClick={() => navigate('/buyer-home')}
        >
          {text.cta}
        </button>
      </div>
    </div>
  );
}

export default NotFound;
