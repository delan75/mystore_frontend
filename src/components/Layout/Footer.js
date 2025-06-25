import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
  const { companyInfo } = useLandingPageData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');

    try {
      // TODO: Replace with actual newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      
      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setNewsletterStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer__main">
          {/* Company Info */}
          <div className="footer__section footer__section--company">
            <div className="footer__logo">
              <Logo variant="light" />
            </div>
            
            <p className="footer__description">
              {companyInfo?.description || 
                "Fresh, organic produce delivered straight from our farm to your table. Supporting sustainable agriculture and healthy living."
              }
            </p>

            {/* Contact Info */}
            <div className="footer__contact">
              {companyInfo?.phone && (
                <div className="footer__contact-item">
                  <i className="fas fa-phone" aria-hidden="true"></i>
                  <a href={`tel:${companyInfo.phone}`} className="footer__contact-link">
                    {companyInfo.phone}
                  </a>
                </div>
              )}
              
              {companyInfo?.email && (
                <div className="footer__contact-item">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  <a href={`mailto:${companyInfo.email}`} className="footer__contact-link">
                    {companyInfo.email}
                  </a>
                </div>
              )}
              
              {companyInfo?.address && (
                <div className="footer__contact-item">
                  <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                  <span className="footer__contact-text">
                    {companyInfo.address}
                  </span>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="footer__social">
              <h4 className="footer__social-title">Follow Us</h4>
              <div className="footer__social-links">
                {companyInfo?.social?.facebook && (
                  <a
                    href={companyInfo.social.facebook}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                  >
                    <i className="fab fa-facebook-f" aria-hidden="true"></i>
                  </a>
                )}
                
                {companyInfo?.social?.instagram && (
                  <a
                    href={companyInfo.social.instagram}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                  >
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                )}
                
                {companyInfo?.social?.twitter && (
                  <a
                    href={companyInfo.social.twitter}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Twitter"
                  >
                    <i className="fab fa-twitter" aria-hidden="true"></i>
                  </a>
                )}
                
                {companyInfo?.social?.youtube && (
                  <a
                    href={companyInfo.social.youtube}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to our YouTube channel"
                  >
                    <i className="fab fa-youtube" aria-hidden="true"></i>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__section-title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/shop" className="footer__link">Shop</Link></li>
              <li><Link to="/about" className="footer__link">About Us</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
              <li><Link to="/blog" className="footer__link">Blog</Link></li>
              <li><Link to="/careers" className="footer__link">Careers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer__section">
            <h4 className="footer__section-title">Customer Service</h4>
            <ul className="footer__links">
              <li><Link to="/support" className="footer__link">Help & Support</Link></li>
              <li><Link to="/shipping" className="footer__link">Shipping Info</Link></li>
              <li><Link to="/returns" className="footer__link">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="footer__link">FAQ</Link></li>
              <li><Link to="/track-order" className="footer__link">Track Your Order</Link></li>
              <li><Link to="/feedback" className="footer__link">Feedback</Link></li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div className="footer__section">
            <h4 className="footer__section-title">Account & Legal</h4>
            <ul className="footer__links">
              <li><Link to="/auth" className="footer__link">Login / Register</Link></li>
              <li><Link to="/dashboard" className="footer__link">My Account</Link></li>
              <li><Link to="/orders/my" className="footer__link">Order History</Link></li>
              <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer__link">Terms of Service</Link></li>
              <li><Link to="/cookies" className="footer__link">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__section footer__section--newsletter">
            <h4 className="footer__section-title">Stay Updated</h4>
            <p className="footer__newsletter-description">
              Subscribe to our newsletter for fresh deals, seasonal updates, and farming tips.
            </p>
            
            <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="footer__newsletter-input-group">
                <input
                  type="email"
                  className="footer__newsletter-input"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={newsletterStatus === 'loading'}
                  aria-label="Email address for newsletter subscription"
                />
                <button
                  type="submit"
                  className="footer__newsletter-button"
                  disabled={newsletterStatus === 'loading' || !newsletterEmail.trim()}
                  aria-label="Subscribe to newsletter"
                >
                  {newsletterStatus === 'loading' ? (
                    <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  ) : (
                    <i className="fas fa-paper-plane" aria-hidden="true"></i>
                  )}
                </button>
              </div>
              
              {newsletterStatus === 'success' && (
                <p className="footer__newsletter-message footer__newsletter-message--success">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  Thank you for subscribing!
                </p>
              )}
              
              {newsletterStatus === 'error' && (
                <p className="footer__newsletter-message footer__newsletter-message--error">
                  <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            {/* Trust Badges */}
            <div className="footer__trust-badges">
              <div className="footer__trust-badge">
                <i className="fas fa-shield-alt" aria-hidden="true"></i>
                <span>Secure Payments</span>
              </div>
              <div className="footer__trust-badge">
                <i className="fas fa-truck" aria-hidden="true"></i>
                <span>Free Delivery</span>
              </div>
              <div className="footer__trust-badge">
                <i className="fas fa-leaf" aria-hidden="true"></i>
                <span>100% Organic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {currentYear} {companyInfo?.name || 'Green Farm Store'}. All rights reserved.
            </p>
            
            <div className="footer__payment-methods">
              <span className="footer__payment-text">We accept:</span>
              <div className="footer__payment-icons">
                <i className="fab fa-cc-visa" aria-hidden="true" title="Visa"></i>
                <i className="fab fa-cc-mastercard" aria-hidden="true" title="Mastercard"></i>
                <i className="fab fa-cc-amex" aria-hidden="true" title="American Express"></i>
                <i className="fab fa-cc-paypal" aria-hidden="true" title="PayPal"></i>
                <i className="fab fa-apple-pay" aria-hidden="true" title="Apple Pay"></i>
                <i className="fab fa-google-pay" aria-hidden="true" title="Google Pay"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
