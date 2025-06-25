import React from 'react';
import PropTypes from 'prop-types';

/**
 * SEOHead Component - React 19 Native Metadata Support
 *
 * This component uses React 19's built-in support for <title>, <meta>, and <link> tags
 * instead of react-helmet-async. React 19 automatically handles:
 * - Deduplication of meta tags
 * - Streaming SSR support
 * - Async script injection
 * - Better performance (no extra JavaScript)
 *
 * Migration Note: Previously used react-helmet-async but migrated to React 19's
 * native metadata support for better compatibility and future-proofing.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} [props.keywords] - Meta keywords
 * @param {string} [props.canonicalUrl] - Canonical URL
 * @param {string} [props.ogImage] - Open Graph image
 * @param {string} [props.ogType='website'] - Open Graph type
 * @param {string} [props.twitterCard='summary_large_image'] - Twitter card type
 * @param {Object|Array} [props.structuredData] - JSON-LD structured data
 * @param {boolean} [props.noIndex=false] - Prevent indexing
 * @param {boolean} [props.noFollow=false] - Prevent following links
 * @param {string} [props.author='MyStore'] - Page author
 * @param {string} [props.locale='en_ZA'] - Page locale
 * @param {string} [props.siteName='MyStore - Fresh Farm Products'] - Site name
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
  noFollow = false,
  author = 'MyStore',
  locale = 'en_ZA',
  siteName = 'MyStore - Fresh Farm Products',
  ...props
}) => {
  // Generate robots meta content
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MyStore",
    "description": "Fresh farm products and organic produce delivery service",
    "url": canonicalUrl || "https://mystore.com",
    "logo": "https://mystore.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+27-11-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["English", "Afrikaans"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Farm Road",
      "addressLocality": "Johannesburg",
      "addressRegion": "Gauteng",
      "postalCode": "2000",
      "addressCountry": "ZA"
    },
    "sameAs": [
      "https://facebook.com/mystorefarming",
      "https://instagram.com/mystorefarming",
      "https://twitter.com/mystorefarming"
    ]
  };

  // Merge custom structured data with default
  const finalStructuredData = structuredData 
    ? Array.isArray(structuredData) 
      ? [defaultStructuredData, ...structuredData]
      : [defaultStructuredData, structuredData]
    : [defaultStructuredData];

  return (
    <>
      {/* Basic Meta Tags - React 19 Native Support */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="language" content="English" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="ZA" />
      <meta name="geo.placename" content="South Africa" />
      <meta name="geo.position" content="-26.2041;28.0473" />
      <meta name="ICBM" content="-26.2041, 28.0473" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {finalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
    </>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  twitterCard: PropTypes.string,
  structuredData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  noIndex: PropTypes.bool,
  noFollow: PropTypes.bool,
  author: PropTypes.string,
  locale: PropTypes.string,
  siteName: PropTypes.string
};

SEOHead.defaultProps = {
  ogType: 'website',
  twitterCard: 'summary_large_image',
  noIndex: false,
  noFollow: false,
  author: 'MyStore',
  locale: 'en_ZA',
  siteName: 'MyStore - Fresh Farm Products'
};

export default SEOHead;
