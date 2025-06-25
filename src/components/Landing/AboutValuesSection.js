import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import SectionHeader from '../UI/SectionHeader';
import OptimizedImage from '../UI/OptimizedImage';
import Button from '../UI/Button';
import './AboutValuesSection.css';

const AboutValuesSection = () => {
  const { companyInfo } = useLandingPageData();
  const [activeValue, setActiveValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Our core values and commitments
  const values = [
    {
      id: 'organic',
      title: '100% Organic',
      subtitle: 'Certified Organic Farming',
      description: 'All our products are certified organic, grown without harmful pesticides, herbicides, or synthetic fertilizers. We believe in nurturing the soil and environment for future generations.',
      icon: 'fas fa-leaf',
      image: '/api/placeholder/400/300',
      stats: { label: 'Organic Farms', value: '50+' },
      color: '#90EE90'
    },
    {
      id: 'sustainable',
      title: 'Sustainable Practices',
      subtitle: 'Environmental Stewardship',
      description: 'We employ regenerative farming techniques that improve soil health, conserve water, and promote biodiversity. Our commitment extends beyond organic to truly sustainable agriculture.',
      icon: 'fas fa-recycle',
      image: '/api/placeholder/400/300',
      stats: { label: 'Carbon Neutral', value: '2023' },
      color: '#4A7C59'
    },
    {
      id: 'local',
      title: 'Local Community',
      subtitle: 'Supporting Local Farmers',
      description: 'We partner exclusively with local farmers within a 100km radius, ensuring freshness while supporting our community. Every purchase directly benefits local farming families.',
      icon: 'fas fa-heart',
      image: '/api/placeholder/400/300',
      stats: { label: 'Local Farmers', value: '120+' },
      color: '#FF6347'
    },
    {
      id: 'quality',
      title: 'Premium Quality',
      subtitle: 'Farm to Table Excellence',
      description: 'From harvest to delivery, we maintain the highest quality standards. Our products are hand-picked at peak ripeness and delivered within 24 hours of harvest.',
      icon: 'fas fa-award',
      image: '/api/placeholder/400/300',
      stats: { label: 'Quality Score', value: '99.8%' },
      color: '#FFD700'
    }
  ];

  // Company story and mission
  const story = {
    title: "Our Story",
    subtitle: "From Farm to Your Table",
    content: [
      "Founded in 2018 by a group of passionate farmers and food enthusiasts, MyStore began as a simple idea: to connect people with the freshest, highest-quality organic produce directly from local farms.",
      "What started as a weekend farmers market stall has grown into a thriving community of over 120 local farmers and thousands of satisfied customers who share our commitment to sustainable, healthy living.",
      "Today, we're proud to be the leading organic produce delivery service in our region, but our mission remains the same: to nourish our community while caring for the environment."
    ],
    image: '/api/placeholder/600/400',
    achievements: [
      { label: 'Years of Service', value: '6+' },
      { label: 'Happy Customers', value: '10K+' },
      { label: 'Deliveries Made', value: '50K+' },
      { label: 'Waste Reduced', value: '80%' }
    ]
  };

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

  // Auto-rotate values every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [values.length]);

  const currentValue = values[activeValue];

  return (
    <section 
      className={`about-values ${isVisible ? 'about-values--visible' : ''}`} 
      id="about-values"
      ref={sectionRef}
    >
      <div className="container">
        <SectionHeader
          title="Our Values & Commitment"
          subtitle="What Makes Us Different"
          description="Discover the principles that guide everything we do, from farm to table."
          alignment="center"
          showDivider={true}
        />

        {/* Values Showcase */}
        <div className="about-values__showcase">
          {/* Values Navigation */}
          <div className="about-values__nav">
            {values.map((value, index) => (
              <button
                key={value.id}
                className={`about-values__nav-item ${
                  index === activeValue ? 'about-values__nav-item--active' : ''
                }`}
                onClick={() => setActiveValue(index)}
                style={{ '--value-color': value.color }}
                aria-pressed={index === activeValue}
              >
                <div className="about-values__nav-icon">
                  <i className={value.icon} aria-hidden="true"></i>
                </div>
                <div className="about-values__nav-content">
                  <h3 className="about-values__nav-title">{value.title}</h3>
                  <p className="about-values__nav-subtitle">{value.subtitle}</p>
                </div>
                <div className="about-values__nav-stat">
                  <span className="about-values__nav-stat-value">{value.stats.value}</span>
                  <span className="about-values__nav-stat-label">{value.stats.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Value Display */}
          <div className="about-values__display">
            <div className="about-values__content">
              <div className="about-values__text">
                <div className="about-values__badge">
                  <i className={currentValue.icon} aria-hidden="true"></i>
                  {currentValue.title}
                </div>
                
                <h3 className="about-values__title">
                  {currentValue.subtitle}
                </h3>
                
                <p className="about-values__description">
                  {currentValue.description}
                </p>

                <div className="about-values__features">
                  <div className="about-values__feature">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <span>Certified & Verified</span>
                  </div>
                  <div className="about-values__feature">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <span>Traceable Source</span>
                  </div>
                  <div className="about-values__feature">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <span>Quality Guaranteed</span>
                  </div>
                </div>
              </div>

              <div className="about-values__image">
                <OptimizedImage
                  src={currentValue.image}
                  alt={`${currentValue.title} - ${currentValue.subtitle}`}
                  className="about-values__img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                <div className="about-values__image-overlay">
                  <div className="about-values__stat-highlight">
                    <span className="about-values__stat-number">
                      {currentValue.stats.value}
                    </span>
                    <span className="about-values__stat-text">
                      {currentValue.stats.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Story */}
        <div className="about-values__story">
          <div className="about-values__story-content">
            <div className="about-values__story-text">
              <h2 className="about-values__story-title">{story.title}</h2>
              <h3 className="about-values__story-subtitle">{story.subtitle}</h3>
              
              {story.content.map((paragraph, index) => (
                <p key={index} className="about-values__story-paragraph">
                  {paragraph}
                </p>
              ))}

              <div className="about-values__story-achievements">
                {story.achievements.map((achievement, index) => (
                  <div key={index} className="about-values__achievement">
                    <span className="about-values__achievement-value">
                      {achievement.value}
                    </span>
                    <span className="about-values__achievement-label">
                      {achievement.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="about-values__story-actions">
                <Button
                  as={Link}
                  to="/about"
                  variant="primary"
                  size="large"
                  icon="fas fa-book-open"
                >
                  Read Our Full Story
                </Button>
                
                <Button
                  as={Link}
                  to="/farmers"
                  variant="outline"
                  size="large"
                  icon="fas fa-users"
                >
                  Meet Our Farmers
                </Button>
              </div>
            </div>

            <div className="about-values__story-image">
              <OptimizedImage
                src={story.image}
                alt="Our farm story and mission"
                className="about-values__story-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              <div className="about-values__story-quote">
                <blockquote>
                  "We believe that good food starts with good soil, and good soil starts with good farming practices."
                </blockquote>
                <cite>— Sarah Johnson, Founder</cite>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="about-values__cta">
          <div className="about-values__cta-content">
            <h3 className="about-values__cta-title">
              Ready to Experience the Difference?
            </h3>
            <p className="about-values__cta-description">
              Join thousands of customers who trust us for their fresh, organic produce needs.
            </p>
            <div className="about-values__cta-actions">
              <Button
                as={Link}
                to="/shop"
                variant="primary"
                size="large"
                icon="fas fa-shopping-cart"
              >
                Start Shopping
              </Button>
              
              <Button
                as={Link}
                to="/contact"
                variant="ghost"
                size="large"
                icon="fas fa-phone"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;
