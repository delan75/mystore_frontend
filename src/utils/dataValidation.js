/**
 * Data validation utilities for landing page
 */

// Type checking utilities
const isString = (value) => typeof value === 'string';
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const isBoolean = (value) => typeof value === 'boolean';
const isArray = (value) => Array.isArray(value);
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Category validation
export const validateCategory = (category) => {
  if (!isObject(category)) return false;
  
  const requiredFields = {
    id: isNumber,
    name: isString,
    slug: isString,
    is_active: isBoolean
  };
  
  const optionalFields = {
    description: (value) => value === null || isString(value),
    parent: (value) => value === null || isNumber(value),
    level: isNumber,
    image: (value) => value === null || isString(value),
    product_count: isNumber,
    children: isArray,
    created_at: isString
  };
  
  // Check required fields
  for (const [field, validator] of Object.entries(requiredFields)) {
    if (!(field in category) || !validator(category[field])) {
      console.warn(`Category validation failed: invalid ${field}`, category);
      return false;
    }
  }
  
  // Check optional fields if present
  for (const [field, validator] of Object.entries(optionalFields)) {
    if (field in category && !validator(category[field])) {
      console.warn(`Category validation failed: invalid ${field}`, category);
      return false;
    }
  }
  
  // Validate children if present
  if (category.children && isArray(category.children)) {
    for (const child of category.children) {
      if (!validateCategory(child)) {
        return false;
      }
    }
  }
  
  return true;
};

// Product validation
export const validateProduct = (product) => {
  if (!isObject(product)) return false;
  
  const requiredFields = {
    id: isNumber,
    name: isString,
    slug: isString,
    price: isString,
    currency: isString,
    is_active: isBoolean,
    images: isArray
  };
  
  const optionalFields = {
    sku: (value) => value === null || isString(value),
    description: (value) => value === null || isString(value),
    short_description: (value) => value === null || isString(value),
    sale_price: (value) => value === null || isString(value),
    category: (value) => value === null || isObject(value),
    brand: (value) => value === null || isObject(value),
    stock_quantity: isNumber,
    is_featured: isBoolean,
    weight: (value) => value === null || isString(value),
    dimensions: (value) => value === null || isString(value),
    meta_title: (value) => value === null || isString(value),
    meta_description: (value) => value === null || isString(value),
    created_at: isString,
    updated_at: isString,
    average_rating: isNumber,
    review_count: isNumber
  };
  
  // Check required fields
  for (const [field, validator] of Object.entries(requiredFields)) {
    if (!(field in product) || !validator(product[field])) {
      console.warn(`Product validation failed: invalid ${field}`, product);
      return false;
    }
  }
  
  // Check optional fields if present
  for (const [field, validator] of Object.entries(optionalFields)) {
    if (field in product && !validator(product[field])) {
      console.warn(`Product validation failed: invalid ${field}`, product);
      return false;
    }
  }
  
  // Validate price format
  if (!isValidPrice(product.price)) {
    console.warn('Product validation failed: invalid price format', product);
    return false;
  }
  
  // Validate sale_price if present
  if (product.sale_price && !isValidPrice(product.sale_price)) {
    console.warn('Product validation failed: invalid sale_price format', product);
    return false;
  }
  
  // Validate images array
  if (!validateProductImages(product.images)) {
    console.warn('Product validation failed: invalid images', product);
    return false;
  }
  
  // Validate category if present
  if (product.category && !validateProductCategory(product.category)) {
    console.warn('Product validation failed: invalid category', product);
    return false;
  }
  
  return true;
};

// Product image validation
export const validateProductImages = (images) => {
  if (!isArray(images)) return false;
  
  return images.every(image => {
    if (!isObject(image)) return false;
    
    const requiredFields = {
      image: isString,
      alt_text: isString
    };
    
    const optionalFields = {
      id: isNumber,
      is_primary: isBoolean
    };
    
    // Check required fields
    for (const [field, validator] of Object.entries(requiredFields)) {
      if (!(field in image) || !validator(image[field])) {
        return false;
      }
    }
    
    // Check optional fields if present
    for (const [field, validator] of Object.entries(optionalFields)) {
      if (field in image && !validator(image[field])) {
        return false;
      }
    }
    
    return true;
  });
};

// Product category validation (simplified)
export const validateProductCategory = (category) => {
  if (!isObject(category)) return false;
  
  return (
    isNumber(category.id) &&
    isString(category.name) &&
    isString(category.slug)
  );
};

// Price validation
export const isValidPrice = (price) => {
  if (!isString(price)) return false;
  
  // Check if price is a valid decimal number
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price);
};

// SEO data validation
export const validateSEOData = (seoData) => {
  if (!isObject(seoData)) return false;
  
  // SEO data structure can vary, so we'll do basic validation
  const optionalFields = {
    title: isString,
    description: isString,
    keywords: isString,
    ogImage: isString,
    canonicalUrl: (value) => isString(value) && isValidUrl(value),
    structuredData: isObject
  };
  
  // Check fields if present
  for (const [field, validator] of Object.entries(optionalFields)) {
    if (field in seoData && !validator(seoData[field])) {
      console.warn(`SEO data validation failed: invalid ${field}`, seoData);
      return false;
    }
  }
  
  return true;
};

// Rating data validation
export const validateRatingData = (ratingData) => {
  if (!isObject(ratingData)) return false;
  
  const requiredFields = {
    average_rating: isNumber,
    total_reviews: isNumber
  };
  
  const optionalFields = {
    rating_distribution: isObject
  };
  
  // Check required fields
  for (const [field, validator] of Object.entries(requiredFields)) {
    if (!(field in ratingData) || !validator(ratingData[field])) {
      console.warn(`Rating data validation failed: invalid ${field}`, ratingData);
      return false;
    }
  }
  
  // Check optional fields if present
  for (const [field, validator] of Object.entries(optionalFields)) {
    if (field in ratingData && !validator(ratingData[field])) {
      console.warn(`Rating data validation failed: invalid ${field}`, ratingData);
      return false;
    }
  }
  
  // Validate rating range
  if (ratingData.average_rating < 0 || ratingData.average_rating > 5) {
    console.warn('Rating data validation failed: rating out of range', ratingData);
    return false;
  }
  
  // Validate review count
  if (ratingData.total_reviews < 0) {
    console.warn('Rating data validation failed: negative review count', ratingData);
    return false;
  }
  
  return true;
};

// Testimonial validation
export const validateTestimonial = (testimonial) => {
  if (!isObject(testimonial)) return false;
  
  const requiredFields = {
    id: isNumber,
    name: isString,
    text: isString,
    rating: isNumber
  };
  
  const optionalFields = {
    location: (value) => value === null || isString(value),
    image: (value) => value === null || isString(value),
    verified: isBoolean,
    date: isString
  };
  
  // Check required fields
  for (const [field, validator] of Object.entries(requiredFields)) {
    if (!(field in testimonial) || !validator(testimonial[field])) {
      console.warn(`Testimonial validation failed: invalid ${field}`, testimonial);
      return false;
    }
  }
  
  // Check optional fields if present
  for (const [field, validator] of Object.entries(optionalFields)) {
    if (field in testimonial && !validator(testimonial[field])) {
      console.warn(`Testimonial validation failed: invalid ${field}`, testimonial);
      return false;
    }
  }
  
  // Validate rating range
  if (testimonial.rating < 1 || testimonial.rating > 5) {
    console.warn('Testimonial validation failed: rating out of range', testimonial);
    return false;
  }
  
  return true;
};

// Batch validation functions
export const validateCategories = (categories) => {
  if (!isArray(categories)) return false;
  return categories.every(validateCategory);
};

export const validateProducts = (products) => {
  if (!isArray(products)) return false;
  return products.every(validateProduct);
};

export const validateTestimonials = (testimonials) => {
  if (!isArray(testimonials)) return false;
  return testimonials.every(validateTestimonial);
};

// Sanitization functions
export const sanitizeString = (str) => {
  if (!isString(str)) return '';
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizePrice = (price) => {
  if (!isString(price)) return '0.00';
  const sanitized = price.replace(/[^\d.]/g, '');
  return isValidPrice(sanitized) ? sanitized : '0.00';
};

export const sanitizeUrl = (url) => {
  if (!isString(url)) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return '';
  }
};

// Data transformation utilities
export const transformApiResponse = (data, validator, fallback = []) => {
  try {
    if (validator(data)) {
      return data;
    } else {
      console.warn('Data validation failed, using fallback');
      return fallback;
    }
  } catch (error) {
    console.error('Data transformation error:', error);
    return fallback;
  }
};

// Export all validation functions
export default {
  validateCategory,
  validateProduct,
  validateProductImages,
  validateProductCategory,
  validateSEOData,
  validateRatingData,
  validateTestimonial,
  validateCategories,
  validateProducts,
  validateTestimonials,
  isValidPrice,
  sanitizeString,
  sanitizePrice,
  sanitizeUrl,
  transformApiResponse
};
