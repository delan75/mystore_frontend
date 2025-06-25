import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEOHead from '../SEO/SEOHead';

const renderWithHelmet = (component) => {
  return render(
    <HelmetProvider>
      {component}
    </HelmetProvider>
  );
};

describe('SEOHead Component', () => {
  test('renders basic meta tags correctly', () => {
    const props = {
      title: 'Test Page Title',
      description: 'Test page description for SEO',
      keywords: 'test, seo, keywords',
      canonicalUrl: 'https://example.com/test'
    };

    renderWithHelmet(<SEOHead {...props} />);

    // Check if title is set
    expect(document.title).toBe('Test Page Title');

    // Check meta tags
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Test page description for SEO'
    );
    expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute(
      'content',
      'test, seo, keywords'
    );

    // Check canonical URL
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://example.com/test'
    );
  });

  test('renders Open Graph meta tags correctly', () => {
    const props = {
      title: 'OG Test Title',
      description: 'OG test description',
      canonicalUrl: 'https://example.com/og-test',
      ogImage: 'https://example.com/og-image.jpg',
      ogType: 'article'
    };

    renderWithHelmet(<SEOHead {...props} />);

    // Check Open Graph tags
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'OG Test Title'
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'OG test description'
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://example.com/og-test'
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://example.com/og-image.jpg'
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
  });

  test('renders Twitter Card meta tags correctly', () => {
    const props = {
      title: 'Twitter Test Title',
      description: 'Twitter test description',
      ogImage: 'https://example.com/twitter-image.jpg',
      twitterCard: 'summary_large_image'
    };

    renderWithHelmet(<SEOHead {...props} />);

    // Check Twitter Card tags
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Twitter Test Title'
    );
    expect(document.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      'Twitter test description'
    );
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      'https://example.com/twitter-image.jpg'
    );
  });

  test('renders structured data correctly', () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Test Organization"
    };

    const props = {
      title: 'Structured Data Test',
      description: 'Test structured data',
      structuredData
    };

    renderWithHelmet(<SEOHead {...props} />);

    // Check structured data script tag
    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    expect(scriptTag).toBeInTheDocument();
    
    const scriptContent = JSON.parse(scriptTag.textContent);
    expect(scriptContent['@type']).toBe('Organization');
    expect(scriptContent.name).toBe('Test Organization');
  });

  test('handles robots meta tag correctly', () => {
    const props = {
      title: 'Robots Test',
      description: 'Test robots meta tag',
      noIndex: true,
      noFollow: false
    };

    renderWithHelmet(<SEOHead {...props} />);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow'
    );
  });

  test('renders geo tags for local SEO', () => {
    const props = {
      title: 'Geo Test',
      description: 'Test geo tags'
    };

    renderWithHelmet(<SEOHead {...props} />);

    expect(document.querySelector('meta[name="geo.region"]')).toHaveAttribute(
      'content',
      'ZA'
    );
    expect(document.querySelector('meta[name="geo.placename"]')).toHaveAttribute(
      'content',
      'South Africa'
    );
    expect(document.querySelector('meta[name="ICBM"]')).toHaveAttribute(
      'content',
      '-26.2041, 28.0473'
    );
  });

  test('includes performance optimization links', () => {
    const props = {
      title: 'Performance Test',
      description: 'Test performance optimization'
    };

    renderWithHelmet(<SEOHead {...props} />);

    // Check preconnect links
    expect(document.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]')).toBeInTheDocument();
    expect(document.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')).toBeInTheDocument();

    // Check DNS prefetch links
    expect(document.querySelector('link[rel="dns-prefetch"][href="//fonts.googleapis.com"]')).toBeInTheDocument();
  });

  afterEach(() => {
    // Clean up document head after each test
    document.head.innerHTML = '';
  });
});
