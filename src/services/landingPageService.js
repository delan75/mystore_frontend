import axiosInstance from '../utils/axios';
import { 
  fallbackCategories, 
  fallbackProducts, 
  fallbackSEOData 
} from '../data/fallbackData';

// Cache manager for API responses
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() <= item.expiry;
  }
}

// Create cache instance
const cache = new CacheManager();

// Retry mechanism for failed requests
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`API call failed, retrying... (${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Data validation functions
const validateCategoryData = (data) => {
  if (!Array.isArray(data)) return false;
  
  return data.every(category => 
    category &&
    typeof category.id === 'number' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string' &&
    typeof category.is_active === 'boolean'
  );
};

const validateProductData = (data) => {
  if (!data || !Array.isArray(data)) return false;
  
  return data.every(product =>
    product &&
    typeof product.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.price === 'string' &&
    Array.isArray(product.images)
  );
};

const validateSEOData = (data) => {
  return data && typeof data === 'object';
};

// API service functions

/**
 * Fetch categories for navigation and featured sections
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Categories array
 */
export const fetchCategories = async (options = {}) => {
  const cacheKey = `categories_${JSON.stringify(options)}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await retryApiCall(async () => {
      return await axiosInstance.get('/api/store/categories/', {
        params: {
          level: 0,
          ordering: 'name',
          ...options
        },
        timeout: 10000
      });
    });

    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from categories API');
    }

    const categories = response.data.data;
    
    // Validate data
    if (!validateCategoryData(categories)) {
      console.warn('Invalid category data received, using fallback');
      return fallbackCategories;
    }

    // Cache successful response
    cache.set(cacheKey, categories, 10 * 60 * 1000); // 10 minutes for categories
    
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    
    // Return fallback data
    return fallbackCategories;
  }
};

/**
 * Fetch featured products for homepage showcase
 * @param {number} limit - Number of products to fetch
 * @param {Object} options - Additional query options
 * @returns {Promise<Array>} Products array
 */
export const fetchFeaturedProducts = async (limit = 8, options = {}) => {
  const cacheKey = `featured_products_${limit}_${JSON.stringify(options)}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await retryApiCall(async () => {
      return await axiosInstance.get('/api/store/products/', {
        params: {
          featured: true,
          in_stock: true,
          ordering: '-created_at',
          page_size: limit,
          ...options
        },
        timeout: 15000
      });
    });

    // Validate response structure
    if (!response.data || !response.data.data || !response.data.data.results) {
      throw new Error('Invalid response structure from products API');
    }

    const products = response.data.data.results;
    
    // Validate data
    if (!validateProductData(products)) {
      console.warn('Invalid product data received, using fallback');
      return fallbackProducts.slice(0, limit);
    }

    // Cache successful response
    cache.set(cacheKey, products, 5 * 60 * 1000); // 5 minutes for products
    
    return products;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    
    // Return fallback data
    return fallbackProducts.slice(0, limit);
  }
};

/**
 * Search products for search functionality
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>} Search results
 */
export const searchProducts = async (query, filters = {}) => {
  const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
  
  // Check cache first (shorter TTL for search)
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await retryApiCall(async () => {
      return await axiosInstance.get('/api/store/products/search/', {
        params: {
          q: query,
          ...filters
        },
        timeout: 10000
      });
    });

    const searchResults = response.data.data || { results: [], total_results: 0 };
    
    // Cache search results for shorter time
    cache.set(cacheKey, searchResults, 2 * 60 * 1000); // 2 minutes for search
    
    return searchResults;
  } catch (error) {
    console.error('Product search failed:', error);
    return { results: [], total_results: 0 };
  }
};

/**
 * Fetch SEO data for optimization
 * @returns {Promise<Object|null>} SEO data or null
 */
export const fetchSEOData = async () => {
  const cacheKey = 'seo_data';
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Note: This endpoint requires superuser authentication
    // For public landing page, we'll gracefully handle auth errors
    const response = await retryApiCall(async () => {
      return await axiosInstance.get('/api/seo/dashboard/overview-data/', {
        timeout: 8000
      });
    });

    const seoData = response.data.data;
    
    // Validate data
    if (!validateSEOData(seoData)) {
      console.warn('Invalid SEO data received, using fallback');
      return fallbackSEOData;
    }

    // Cache SEO data for longer time
    cache.set(cacheKey, seoData, 15 * 60 * 1000); // 15 minutes for SEO data
    
    return seoData;
  } catch (error) {
    // SEO data is optional for public users
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.info('SEO data requires authentication, using fallback');
    } else {
      console.error('Failed to fetch SEO data:', error);
    }
    
    return fallbackSEOData;
  }
};

/**
 * Fetch product rating summary
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Rating data
 */
export const fetchProductRating = async (productId) => {
  const cacheKey = `product_rating_${productId}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await retryApiCall(async () => {
      return await axiosInstance.get(`/api/store/products/${productId}/rating-summary/`, {
        timeout: 5000
      });
    });

    const ratingData = response.data.data || { average_rating: 0, total_reviews: 0 };
    
    // Cache rating data
    cache.set(cacheKey, ratingData, 10 * 60 * 1000); // 10 minutes for ratings
    
    return ratingData;
  } catch (error) {
    console.error('Failed to fetch product rating:', error);
    return { average_rating: 0, total_reviews: 0 };
  }
};

/**
 * Prefetch data for better UX
 * @param {string} type - Type of data to prefetch
 * @param {*} params - Parameters for prefetching
 */
export const prefetchData = async (type, params = {}) => {
  try {
    switch (type) {
      case 'category_products':
        if (params.categorySlug) {
          await fetchFeaturedProducts(12, { category: params.categorySlug });
        }
        break;
      
      case 'product_details':
        if (params.productId) {
          await fetchProductRating(params.productId);
        }
        break;
      
      default:
        console.warn(`Unknown prefetch type: ${type}`);
    }
  } catch (error) {
    console.error('Prefetch failed:', error);
  }
};

/**
 * Clear cache for specific key or all cache
 * @param {string} key - Specific cache key to clear (optional)
 */
export const clearCache = (key = null) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  return {
    size: cache.cache.size,
    keys: Array.from(cache.cache.keys())
  };
};

// Export cache manager for advanced usage
export { cache };

// Error handling utility
export const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  // Log error for monitoring in production
  if (process.env.NODE_ENV === 'production') {
    // Here you would send to error tracking service like Sentry
    // errorTracker.captureException(error);
  }
  
  return fallbackData;
};

// Rate limiting awareness
export const rateLimitedRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
      
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return await apiCall();
    }
    throw error;
  }
};
