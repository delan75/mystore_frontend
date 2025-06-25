import React, { useState, useEffect, useRef } from 'react';
import { useLandingPageData } from '../../context/LandingPageContext';
import SectionHeader from '../UI/SectionHeader';
import OptimizedImage from '../UI/OptimizedImage';
import LoadingSpinner from '../UI/LoadingSpinner';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const { testimonials, loading: dataLoading, testimonialsError } = useLandingPageData();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fallback testimonials if none from backend
  const fallbackTestimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Working Mother',
      location: 'Cape Town',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      content: 'The quality of produce from MyStore is absolutely incredible! Everything arrives fresh, and my family loves the taste. The organic vegetables have made such a difference in our meals.',
      product: 'Organic Vegetable Box',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Restaurant Owner',
      location: 'Johannesburg',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      content: 'As a chef, I demand the highest quality ingredients. MyStore consistently delivers exceptional produce that my customers rave about. The freshness and flavor are unmatched.',
      product: 'Premium Chef Selection',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Health Enthusiast',
      location: 'Durban',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      content: 'Switching to MyStore has transformed my health journey. The organic fruits and vegetables are so much more nutritious and flavorful than anything I found in regular stores.',
      product: 'Organic Fruit & Veggie Mix',
      date: '2024-01-08',
      verified: true
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Fitness Coach',
      location: 'Pretoria',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      content: 'I recommend MyStore to all my clients. The quality of their organic produce supports the healthy lifestyle we\'re all working towards. Delivery is always on time too!',
      product: 'Athlete Nutrition Pack',
      date: '2024-01-05',
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      role: 'Busy Professional',
      location: 'Cape Town',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      content: 'MyStore has been a lifesaver for my busy schedule. Fresh, organic produce delivered right to my door. The convenience and quality make it worth every penny.',
      product: 'Weekly Essentials Box',
      date: '2024-01-03',
      verified: true
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

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

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length]);

  const handleTestimonialChange = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? displayTestimonials.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Calculate statistics
  const stats = {
    totalReviews: displayTestimonials.length,
    averageRating: displayTestimonials.reduce((sum, t) => sum + t.rating, 0) / displayTestimonials.length,
    verifiedReviews: displayTestimonials.filter(t => t.verified).length,
    satisfactionRate: 98.5
  };

  if (testimonialsError) {
    return (
      <section className="testimonials testimonials--error">
        <div className="container">
          <SectionHeader
            title="Customer Testimonials"
            subtitle="Unable to load testimonials"
            description="Please try again later."
          />
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`testimonials ${isVisible ? 'testimonials--visible' : ''}`} 
      id="testimonials"
      ref={sectionRef}
    >
      <div className="container">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real Stories, Real Satisfaction"
          description="Discover why thousands of customers trust us for their fresh, organic produce needs."
          alignment="center"
          showDivider={true}
        />

        {dataLoading ? (
          <div className="testimonials__loading">
            <LoadingSpinner size="large" color="primary" text="Loading testimonials..." />
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="testimonials__stats">
              <div className="testimonials__stat">
                <span className="testimonials__stat-number">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div className="testimonials__stat-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${
                        star <= Math.round(stats.averageRating)
                          ? 'testimonials__star--filled'
                          : 'testimonials__star--empty'
                      }`}
                      aria-hidden="true"
                    ></i>
                  ))}
                </div>
                <span className="testimonials__stat-label">Average Rating</span>
              </div>

              <div className="testimonials__stat">
                <span className="testimonials__stat-number">{stats.totalReviews}K+</span>
                <span className="testimonials__stat-label">Happy Customers</span>
              </div>

              <div className="testimonials__stat">
                <span className="testimonials__stat-number">{stats.satisfactionRate}%</span>
                <span className="testimonials__stat-label">Satisfaction Rate</span>
              </div>

              <div className="testimonials__stat">
                <span className="testimonials__stat-number">{stats.verifiedReviews}</span>
                <span className="testimonials__stat-label">Verified Reviews</span>
              </div>
            </div>

            {/* Main Testimonial Display */}
            <div className="testimonials__main">
              <div className="testimonials__carousel">
                <div className="testimonials__content">
                  {displayTestimonials.map((testimonial, index) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      isActive={index === currentTestimonial}
                      index={index}
                    />
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="testimonials__controls">
                  <button
                    className="testimonials__nav testimonials__nav--prev"
                    onClick={handlePrevTestimonial}
                    aria-label="Previous testimonial"
                  >
                    <i className="fas fa-chevron-left" aria-hidden="true"></i>
                  </button>

                  <div className="testimonials__indicators">
                    {displayTestimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`testimonials__indicator ${
                          index === currentTestimonial ? 'testimonials__indicator--active' : ''
                        }`}
                        onClick={() => handleTestimonialChange(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === currentTestimonial ? 'true' : 'false'}
                      />
                    ))}
                  </div>

                  <button
                    className="testimonials__nav testimonials__nav--next"
                    onClick={handleNextTestimonial}
                    aria-label="Next testimonial"
                  >
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </button>
                </div>

                {/* Auto-play Toggle */}
                <button
                  className="testimonials__autoplay-toggle"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'}`} aria-hidden="true"></i>
                </button>
              </div>

              {/* Testimonial Grid Preview */}
              <div className="testimonials__grid">
                {displayTestimonials.slice(0, 3).map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`testimonials__grid-item ${
                      index === currentTestimonial ? 'testimonials__grid-item--active' : ''
                    }`}
                    onClick={() => handleTestimonialChange(index)}
                  >
                    <OptimizedImage
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s avatar`}
                      className="testimonials__grid-avatar"
                      sizes="60px"
                    />
                    <div className="testimonials__grid-info">
                      <h4 className="testimonials__grid-name">{testimonial.name}</h4>
                      <p className="testimonials__grid-role">{testimonial.role}</p>
                      <div className="testimonials__grid-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fas fa-star ${
                              star <= testimonial.rating
                                ? 'testimonials__star--filled'
                                : 'testimonials__star--empty'
                            }`}
                            aria-hidden="true"
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive, index }) => {
  return (
    <div 
      className={`testimonials__card ${isActive ? 'testimonials__card--active' : ''}`}
      style={{ '--animation-delay': `${index * 0.1}s` }}
    >
      <div className="testimonials__card-content">
        {/* Quote Icon */}
        <div className="testimonials__quote-icon">
          <i className="fas fa-quote-left" aria-hidden="true"></i>
        </div>

        {/* Rating */}
        <div className="testimonials__rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`fas fa-star ${
                star <= testimonial.rating
                  ? 'testimonials__star--filled'
                  : 'testimonials__star--empty'
              }`}
              aria-hidden="true"
            ></i>
          ))}
        </div>

        {/* Content */}
        <blockquote className="testimonials__content">
          "{testimonial.content}"
        </blockquote>

        {/* Product */}
        {testimonial.product && (
          <div className="testimonials__product">
            <i className="fas fa-shopping-bag" aria-hidden="true"></i>
            <span>Purchased: {testimonial.product}</span>
          </div>
        )}

        {/* Author */}
        <div className="testimonials__author">
          <OptimizedImage
            src={testimonial.avatar}
            alt={`${testimonial.name}'s avatar`}
            className="testimonials__avatar"
            sizes="60px"
          />
          <div className="testimonials__author-info">
            <h4 className="testimonials__name">
              {testimonial.name}
              {testimonial.verified && (
                <i 
                  className="fas fa-check-circle testimonials__verified" 
                  aria-label="Verified customer"
                  title="Verified customer"
                ></i>
              )}
            </h4>
            <p className="testimonials__role">{testimonial.role}</p>
            <p className="testimonials__location">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              {testimonial.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
