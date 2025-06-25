import React from 'react';
import { useLandingPageData } from '../context/LandingPageContext';
import { useLandingPageSEO } from '../hooks/useSEO';
import SEOHead from '../components/SEO/SEOHead';
import LoadingSpinner from '../components/UI/LoadingSpinner';

// Landing Page Sections
import HeroSection from '../components/Landing/HeroSection';
import FeaturedProductsSection from '../components/Landing/FeaturedProductsSection';
import CategoriesSection from '../components/Landing/CategoriesSection';
import AboutValuesSection from '../components/Landing/AboutValuesSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import NewsletterCTASection from '../components/Landing/NewsletterCTASection';

import './LandingPage.css';

// Landing page component
const LandingPage = () => {
  const { loading, error } = useLandingPageData();

  // Get SEO configuration
  const { seoConfig, structuredData } = useLandingPageSEO();

  // Show loading state for initial page load
  if (loading) {
    return (
      <div className="landing-page landing-page--loading">
        <div className="landing-page__loading">
          <LoadingSpinner
            size="large"
            color="primary"
            text="Loading fresh content..."
          />
        </div>
      </div>
    );
  }

  // Show error state if critical data fails to load
  if (error) {
    return (
      <div className="landing-page landing-page--error">
        <SEOHead
          title="MyStore - Fresh Farm Products"
          description="Fresh, organic produce delivered from farm to table. Quality guaranteed."
          keywords="organic, fresh, vegetables, fruits, farm, delivery"
          canonicalUrl={window.location.href}
          ogType="website"
        />
        <div className="landing-page__error">
          <div className="container">
            <div className="landing-page__error-content">
              <h1>Oops! Something went wrong</h1>
              <p>We're having trouble loading the page. Please try refreshing or come back later.</p>
              <button
                onClick={() => window.location.reload()}
                className="landing-page__error-button"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* SEO Head with React 19 Native Metadata */}
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl={seoConfig.canonicalUrl}
        ogImage={seoConfig.ogImage}
        ogType={seoConfig.ogType}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* About & Values Section */}
      <AboutValuesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter & Final CTA Section */}
      <NewsletterCTASection />
    </div>
  );
};

export default LandingPage;
