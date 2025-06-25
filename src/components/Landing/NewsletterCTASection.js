import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import SectionHeader from '../UI/SectionHeader';
import Button from '../UI/Button';
import OptimizedImage from '../UI/OptimizedImage';
import './NewsletterCTASection.css';

const NewsletterCTASection = () => {
  const { companyInfo } = useLandingPageData();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('idle'); // idle, loading, success, error
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Newsletter benefits
  const benefits = [
    {
      icon: 'fas fa-percent',
      title: 'Exclusive Discounts',
      description: 'Get 15% off your first order and access to member-only deals'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Seasonal Updates',
      description: 'Be the first to know about seasonal produce and harvest schedules'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Recipe Ideas',
      description: 'Weekly recipes and cooking tips featuring our fresh ingredients'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Farm News',
      description: 'Stories from our partner farms and sustainability initiatives'
    }
  ];

  // Call-to-action options
  const ctaOptions = [
    {
      title: 'Start Shopping',
      description: 'Browse our fresh selection',
      link: '/shop',
      variant: 'primary',
      icon: 'fas fa-shopping-cart'
    },
    {
      title: 'Learn More',
      description: 'Discover our story',
      link: '/about',
      variant: 'outline',
      icon: 'fas fa-book-open'
    },
    {
      title: 'Contact Us',
      description: 'Get in touch',
      link: '/contact',
      variant: 'ghost',
      icon: 'fas fa-phone'
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
      return;
    }

    setSubscriptionStatus('loading');

    try {
      // TODO: Replace with actual newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
      
      setSubscriptionStatus('success');
      setEmail('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setSubscriptionStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 3000);
    }
  };

  return (
    <section 
      className={`newsletter-cta ${isVisible ? 'newsletter-cta--visible' : ''}`} 
      id="newsletter-cta"
      ref={sectionRef}
    >
      <div className="container">
        {/* Newsletter Section */}
        <div className="newsletter-cta__newsletter">
          <div className="newsletter-cta__newsletter-content">
            <div className="newsletter-cta__newsletter-text">
              <SectionHeader
                title="Stay Fresh with Our Newsletter"
                subtitle="Join the Farm Family"
                description="Get exclusive access to seasonal produce, recipes, farm stories, and special offers delivered straight to your inbox."
                alignment="left"
                showDivider={false}
              />

              {/* Newsletter Form */}
              <form className="newsletter-cta__form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-cta__input-group">
                  <div className="newsletter-cta__input-wrapper">
                    <i className="fas fa-envelope newsletter-cta__input-icon" aria-hidden="true"></i>
                    <input
                      type="email"
                      className="newsletter-cta__input"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={subscriptionStatus === 'loading'}
                      aria-label="Email address for newsletter subscription"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={subscriptionStatus === 'loading' || !email.trim()}
                    className="newsletter-cta__submit"
                  >
                    {subscriptionStatus === 'loading' ? (
                      <>
                        <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane" aria-hidden="true"></i>
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Status Messages */}
                {subscriptionStatus === 'success' && (
                  <div className="newsletter-cta__message newsletter-cta__message--success">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    Welcome to the farm family! Check your email for a special welcome offer.
                  </div>
                )}
                
                {subscriptionStatus === 'error' && (
                  <div className="newsletter-cta__message newsletter-cta__message--error">
                    <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                    Please enter a valid email address.
                  </div>
                )}

                <p className="newsletter-cta__privacy">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i>
                  We respect your privacy. Unsubscribe at any time.
                  <Link to="/privacy" className="newsletter-cta__privacy-link">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>

            {/* Newsletter Benefits */}
            <div className="newsletter-cta__benefits">
              <h3 className="newsletter-cta__benefits-title">What You'll Get:</h3>
              <div className="newsletter-cta__benefits-grid">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="newsletter-cta__benefit"
                    style={{ '--animation-delay': `${index * 0.1}s` }}
                  >
                    <div className="newsletter-cta__benefit-icon">
                      <i className={benefit.icon} aria-hidden="true"></i>
                    </div>
                    <div className="newsletter-cta__benefit-content">
                      <h4 className="newsletter-cta__benefit-title">{benefit.title}</h4>
                      <p className="newsletter-cta__benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Image */}
          <div className="newsletter-cta__newsletter-image">
            <OptimizedImage
              src="/api/placeholder/500/400"
              alt="Fresh vegetables and newsletter signup"
              className="newsletter-cta__img"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            <div className="newsletter-cta__image-overlay">
              <div className="newsletter-cta__stats">
                <div className="newsletter-cta__stat">
                  <span className="newsletter-cta__stat-number">15K+</span>
                  <span className="newsletter-cta__stat-label">Subscribers</span>
                </div>
                <div className="newsletter-cta__stat">
                  <span className="newsletter-cta__stat-number">4.9★</span>
                  <span className="newsletter-cta__stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="newsletter-cta__final">
          <div className="newsletter-cta__final-content">
            <h2 className="newsletter-cta__final-title">
              Ready to Experience Farm-Fresh Quality?
            </h2>
            <p className="newsletter-cta__final-description">
              Join thousands of satisfied customers who trust us for their organic produce needs. 
              From our farm to your table, we guarantee freshness and quality in every delivery.
            </p>

            <div className="newsletter-cta__actions">
              {ctaOptions.map((cta, index) => (
                <Button
                  key={index}
                  as={Link}
                  to={cta.link}
                  variant={cta.variant}
                  size="large"
                  icon={cta.icon}
                  className="newsletter-cta__action"
                >
                  <span className="newsletter-cta__action-content">
                    <span className="newsletter-cta__action-title">{cta.title}</span>
                    <span className="newsletter-cta__action-description">{cta.description}</span>
                  </span>
                </Button>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="newsletter-cta__trust">
              <div className="newsletter-cta__trust-item">
                <i className="fas fa-truck" aria-hidden="true"></i>
                <span>Free delivery on orders over R500</span>
              </div>
              <div className="newsletter-cta__trust-item">
                <i className="fas fa-undo" aria-hidden="true"></i>
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="newsletter-cta__trust-item">
                <i className="fas fa-leaf" aria-hidden="true"></i>
                <span>Certified organic produce</span>
              </div>
              <div className="newsletter-cta__trust-item">
                <i className="fas fa-clock" aria-hidden="true"></i>
                <span>24-hour freshness promise</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="newsletter-cta__contact">
              <p className="newsletter-cta__contact-text">
                Questions? We're here to help!
              </p>
              <div className="newsletter-cta__contact-methods">
                {companyInfo?.phone && (
                  <a 
                    href={`tel:${companyInfo.phone}`} 
                    className="newsletter-cta__contact-method"
                  >
                    <i className="fas fa-phone" aria-hidden="true"></i>
                    {companyInfo.phone}
                  </a>
                )}
                {companyInfo?.email && (
                  <a 
                    href={`mailto:${companyInfo.email}`} 
                    className="newsletter-cta__contact-method"
                  >
                    <i className="fas fa-envelope" aria-hidden="true"></i>
                    {companyInfo.email}
                  </a>
                )}
                <Link to="/support" className="newsletter-cta__contact-method">
                  <i className="fas fa-question-circle" aria-hidden="true"></i>
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTASection;
