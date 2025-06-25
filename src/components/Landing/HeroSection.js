import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import OptimizedImage from '../UI/OptimizedImage';
import Button from '../UI/Button';
import './HeroSection.css';

const HeroSection = () => {
  const { featuredProducts, companyInfo, loading } = useLandingPageData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero slides data - can be from backend or fallback
  const heroSlides = [
    {
      id: 1,
      title: "Fresh Organic Vegetables",
      subtitle: "Farm to Table in 24 Hours",
      description: "Experience the freshest organic produce delivered straight from local farms to your doorstep. Taste the difference quality makes.",
      image: "/api/placeholder/1200/600",
      cta: {
        primary: { text: "Shop Vegetables", link: "/shop/category/vegetables" },
        secondary: { text: "Learn More", link: "/about" }
      },
      badge: "100% Organic"
    },
    {
      id: 2,
      title: "Seasonal Fresh Fruits",
      subtitle: "Nature's Candy at Its Peak",
      description: "Discover handpicked seasonal fruits bursting with natural sweetness and nutrients. Supporting local orchards and sustainable farming.",
      image: "/api/placeholder/1200/600",
      cta: {
        primary: { text: "Shop Fruits", link: "/shop/category/fruits" },
        secondary: { text: "View Seasonal Guide", link: "/seasonal" }
      },
      badge: "Locally Sourced"
    },
    {
      id: 3,
      title: "Premium Farm Products",
      subtitle: "Quality You Can Trust",
      description: "From fresh dairy to artisanal preserves, explore our curated selection of premium farm products made with traditional methods.",
      image: "/api/placeholder/1200/600",
      cta: {
        primary: { text: "Explore Products", link: "/shop" },
        secondary: { text: "Meet Our Farmers", link: "/farmers" }
      },
      badge: "Artisan Made"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="hero" role="banner" aria-label="Hero section">
      <div className="hero__container">
        {/* Background Slides */}
        <div className="hero__background">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
              aria-hidden={index !== currentSlide}
            >
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                className="hero__image"
                priority={index === 0}
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="hero__overlay" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="hero__content">
          <div className="container">
            <div className="hero__text">
              {/* Badge */}
              {currentSlideData.badge && (
                <div className="hero__badge" aria-label={`Badge: ${currentSlideData.badge}`}>
                  <i className="fas fa-leaf" aria-hidden="true"></i>
                  {currentSlideData.badge}
                </div>
              )}

              {/* Main Content */}
              <h1 className="hero__title">
                {currentSlideData.title}
              </h1>
              
              <h2 className="hero__subtitle">
                {currentSlideData.subtitle}
              </h2>
              
              <p className="hero__description">
                {currentSlideData.description}
              </p>

              {/* Call to Action Buttons */}
              <div className="hero__actions">
                <Button
                  as={Link}
                  to={currentSlideData.cta.primary.link}
                  variant="primary"
                  size="large"
                  icon="fas fa-shopping-cart"
                  className="hero__cta-primary"
                >
                  {currentSlideData.cta.primary.text}
                </Button>
                
                <Button
                  as={Link}
                  to={currentSlideData.cta.secondary.link}
                  variant="outline"
                  size="large"
                  className="hero__cta-secondary"
                >
                  {currentSlideData.cta.secondary.text}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="hero__trust">
                <div className="hero__trust-item">
                  <i className="fas fa-truck" aria-hidden="true"></i>
                  <span>Free Delivery</span>
                </div>
                <div className="hero__trust-item">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i>
                  <span>Quality Guaranteed</span>
                </div>
                <div className="hero__trust-item">
                  <i className="fas fa-leaf" aria-hidden="true"></i>
                  <span>100% Organic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="hero__controls">
          {/* Previous/Next Buttons */}
          <button
            className="hero__nav hero__nav--prev"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          
          <button
            className="hero__nav hero__nav--next"
            onClick={handleNextSlide}
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
          </button>

          {/* Slide Indicators */}
          <div className="hero__indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`hero__indicator ${index === currentSlide ? 'hero__indicator--active' : ''}`}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            className="hero__autoplay-toggle"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'}`} aria-hidden="true"></i>
          </button>
        </div>

        {/* Featured Products Preview */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="hero__featured-preview">
            <div className="container">
              <div className="hero__featured-content">
                <h3 className="hero__featured-title">Featured Today</h3>
                <div className="hero__featured-products">
                  {featuredProducts.slice(0, 3).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug || product.id}`}
                      className="hero__featured-product"
                    >
                      <OptimizedImage
                        src={product.image || '/api/placeholder/100/100'}
                        alt={product.name}
                        className="hero__featured-image"
                        sizes="100px"
                      />
                      <div className="hero__featured-info">
                        <span className="hero__featured-name">{product.name}</span>
                        <span className="hero__featured-price">
                          {product.currency} {product.sale_price || product.price}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/shop" className="hero__featured-link">
                  View All Products
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
