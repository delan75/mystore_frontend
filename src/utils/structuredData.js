/**
 * Structured Data utilities for SEO optimization
 * Generates JSON-LD structured data for various page types
 */

// Base organization schema
export const getOrganizationSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyStore",
  "description": "Fresh farm products and organic produce delivery service",
  "url": "https://mystore.com",
  "logo": "https://mystore.com/images/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+27-11-123-4567",
    "contactType": "customer service",
    "availableLanguage": ["English", "Afrikaans"],
    "areaServed": "ZA"
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
  ],
  "foundingDate": "2020-01-01",
  "numberOfEmployees": "10-50",
  "slogan": "Fresh Farm Products Delivered to Your Door",
  ...customData
});

// Local business schema
export const getLocalBusinessSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MyStore Farm Products",
  "image": "https://mystore.com/images/store-front.jpg",
  "description": "Local organic farm products and fresh produce delivery",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Farm Road",
    "addressLocality": "Johannesburg",
    "addressRegion": "Gauteng",
    "postalCode": "2000",
    "addressCountry": "ZA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -26.2041,
    "longitude": 28.0473
  },
  "telephone": "+27-11-123-4567",
  "email": "info@mystore.com",
  "url": "https://mystore.com",
  "openingHours": [
    "Mo-Fr 08:00-18:00",
    "Sa 08:00-16:00"
  ],
  "priceRange": "$$",
  "servesCuisine": "Organic Farm Products",
  "paymentAccepted": "Cash, Credit Card, Debit Card, Online Payment",
  "currenciesAccepted": "ZAR",
  "serviceArea": [
    {
      "@type": "City",
      "name": "Johannesburg"
    },
    {
      "@type": "City",
      "name": "Pretoria"
    },
    {
      "@type": "City",
      "name": "Sandton"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  ...customData
});

// Website schema
export const getWebsiteSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MyStore - Fresh Farm Products",
  "description": "Online store for fresh, organic farm products delivered to your door",
  "url": "https://mystore.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mystore.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MyStore",
    "logo": "https://mystore.com/images/logo.png"
  },
  "inLanguage": "en-ZA",
  "copyrightYear": "2024",
  "copyrightHolder": {
    "@type": "Organization",
    "name": "MyStore"
  },
  ...customData
});

// Product schema
export const getProductSchema = (product, customData = {}) => {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.short_description,
    "image": product.images?.map(img => img.image) || [],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "MyStore Organic"
    },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "price": product.sale_price || product.price,
      "priceCurrency": product.currency || "ZAR",
      "availability": product.stock_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MyStore"
      },
      "validFrom": new Date().toISOString(),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    },
    "weight": product.weight ? {
      "@type": "QuantitativeValue",
      "value": parseFloat(product.weight),
      "unitCode": "KGM"
    } : undefined,
    ...customData
  };

  // Add aggregate rating if available
  if (product.average_rating && product.review_count) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.average_rating,
      "reviewCount": product.review_count,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Add nutrition information for food products
  if (product.category?.name?.toLowerCase().includes('vegetable') || 
      product.category?.name?.toLowerCase().includes('fruit')) {
    schema.nutrition = {
      "@type": "NutritionInformation",
      "calories": "Variable per serving"
    };
  }

  return schema;
};

// Product list schema (for category pages)
export const getProductListSchema = (products, categoryName, customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": `${categoryName} Products`,
  "description": `Fresh organic ${categoryName.toLowerCase()} available for delivery`,
  "numberOfItems": products.length,
  "itemListElement": products.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": product.name,
      "url": `https://mystore.com/products/${product.slug}`,
      "image": product.images?.[0]?.image,
      "offers": {
        "@type": "Offer",
        "price": product.sale_price || product.price,
        "priceCurrency": product.currency || "ZAR"
      }
    }
  })),
  ...customData
});

// Breadcrumb schema
export const getBreadcrumbSchema = (breadcrumbs, customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  })),
  ...customData
});

// FAQ schema
export const getFAQSchema = (faqs, customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  })),
  ...customData
});

// Review schema
export const getReviewSchema = (review, product, customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.image,
    "offers": {
      "@type": "Offer",
      "price": product.sale_price || product.price,
      "priceCurrency": product.currency || "ZAR"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": review.rating,
    "bestRating": "5",
    "worstRating": "1"
  },
  "name": review.title,
  "reviewBody": review.comment,
  "author": {
    "@type": "Person",
    "name": review.author_name
  },
  "datePublished": review.created_at,
  "publisher": {
    "@type": "Organization",
    "name": "MyStore"
  },
  ...customData
});

// Landing page specific schema
export const getLandingPageSchema = (categories, featuredProducts, customData = {}) => {
  const schemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebsiteSchema()
  ];

  // Add product list for featured products
  if (featuredProducts && featuredProducts.length > 0) {
    schemas.push(getProductListSchema(
      featuredProducts, 
      "Featured Products",
      {
        description: "Hand-picked selection of our best organic farm products"
      }
    ));
  }

  // Add offer catalog
  if (categories && categories.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "name": "MyStore Product Catalog",
      "description": "Complete catalog of fresh farm products and organic produce",
      "itemListElement": categories.map(category => ({
        "@type": "OfferCatalog",
        "name": category.name,
        "description": category.description,
        "numberOfItems": category.product_count
      }))
    });
  }

  return schemas;
};

// Utility function to validate structured data
export const validateStructuredData = (data) => {
  try {
    if (typeof data === 'string') {
      JSON.parse(data);
    } else if (typeof data === 'object') {
      JSON.stringify(data);
    }
    return true;
  } catch (error) {
    console.error('Invalid structured data:', error);
    return false;
  }
};

// Utility function to minify structured data
export const minifyStructuredData = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to minify structured data:', error);
    return null;
  }
};

// Export all schemas as default
export default {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebsiteSchema,
  getProductSchema,
  getProductListSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getReviewSchema,
  getLandingPageSchema,
  validateStructuredData,
  minifyStructuredData
};
