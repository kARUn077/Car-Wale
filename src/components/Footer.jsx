import { useNavigate } from 'react-router-dom'
import { useUserLanguage, getText } from '../utils/language'
import './Footer.css'

function Footer() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const userLanguage = useUserLanguage()

  const text = getText({
    English: {
      tagline: "India's trusted marketplace to buy and sell pre-owned cars with confidence.",
      quickLinks: 'Quick Links',
      explore: 'Explore',
      support: 'Support',
      browseCars: 'Browse Cars',
      wishlist: 'Wishlist',
      myListings: 'My Listings',
      addCar: 'Add Car',
      profile: 'My Profile',
      carDetails: 'Car Details',
      about: 'About CarWale',
      howItWorks: 'How It Works',
      compareCars: 'Compare Cars',
      aiAssistant: 'AI Assistant',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      location: 'Available across major Indian cities',
      email: 'support@carwale.com',
      phone: '+91 1800-XXX-XXXX',
      rights: 'All rights reserved.',
      madeIn: 'Made with ❤️ in India'
    },
    Hindi: {
      tagline: 'भारत का विश्वसनीय मार्केटप्लेस — पुरानी कारें आसानी से खरीदें और बेचें।',
      quickLinks: 'त्वरित लिंक',
      explore: 'एक्सप्लोर',
      support: 'सहायता',
      browseCars: 'कारें देखें',
      wishlist: 'विशलिस्ट',
      myListings: 'मेरी लिस्टिंग',
      addCar: 'कार जोड़ें',
      profile: 'मेरी प्रोफ़ाइल',
      carDetails: 'कार विवरण',
      about: 'CarWale के बारे में',
      howItWorks: 'यह कैसे काम करता है',
      compareCars: 'कारों की तुलना',
      aiAssistant: 'AI सहायक',
      helpCenter: 'सहायता केंद्र',
      contactUs: 'संपर्क करें',
      privacy: 'गोपनीयता नीति',
      terms: 'उपयोग की शर्तें',
      location: 'प्रमुख भारतीय शहरों में उपलब्ध',
      email: 'support@carwale.com',
      phone: '+91 1800-XXX-XXXX',
      rights: 'सर्वाधिकार सुरक्षित।',
      madeIn: 'भारत में ❤️ से बनाया गया'
    }
  }, userLanguage)

  function go(path) {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const homePath = role === 'seller' ? '/seller-home' : '/buyer-home'

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => go(homePath)}>
              <div className="footer-logo-icon">C</div>
              <span className="footer-logo-text">
                Car<span className="footer-logo-red">Wale</span>
              </span>
            </div>
            <p className="footer-tagline">{text.tagline}</p>
            <div className="footer-contact-chips">
              <span className="footer-chip">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {text.location}
              </span>
              <a className="footer-chip" href={`mailto:${text.email}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {text.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>{text.quickLinks}</h4>
            <ul>
              {role === 'buyer' && (
                <>
                  <li><button type="button" onClick={() => go('/buyer-home')}>{text.browseCars}</button></li>
                  <li><button type="button" onClick={() => go('/wishlist')}>{text.wishlist}</button></li>
                </>
              )}
              {role === 'seller' && (
                <>
                  <li><button type="button" onClick={() => go('/seller-home')}>{text.myListings}</button></li>
                  <li><button type="button" onClick={() => go('/seller-add-car')}>{text.addCar}</button></li>
                </>
              )}
              {!role && (
                <li><button type="button" onClick={() => go('/buyer-home')}>{text.browseCars}</button></li>
              )}
              <li><button type="button" onClick={() => go('/profile')}>{text.profile}</button></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4>{text.explore}</h4>
            <ul>
              <li><button type="button" onClick={() => go(homePath)}>{text.about}</button></li>
              <li><button type="button" onClick={() => go(homePath)}>{text.howItWorks}</button></li>
              <li><button type="button" onClick={() => go(homePath)}>{text.compareCars}</button></li>
              <li><button type="button" onClick={() => go(homePath)}>{text.aiAssistant}</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>{text.support}</h4>
            <ul>
              <li><button type="button" onClick={() => go('/profile')}>{text.helpCenter}</button></li>
              <li><button type="button" onClick={() => go('/profile')}>{text.contactUs}</button></li>
              <li><button type="button" onClick={() => go('/profile')}>{text.privacy}</button></li>
              <li><button type="button" onClick={() => go('/profile')}>{text.terms}</button></li>
            </ul>
            <p className="footer-phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {text.phone}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Car<span className="footer-logo-red">Wale</span>. {text.rights}
          </p>
          <p className="footer-made">{text.madeIn}</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
