# API Integration Planning

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**Status**: Planning Phase

## API Overview

### Backend Base URL
- **Development**: `http://localhost:8000/api/`
- **Production**: `https://yourdomain.com/api/`

### Authentication Strategy
- **Public endpoints**: No authentication required for landing page data
- **Optional authentication**: Enhanced features for logged-in users
- **Graceful degradation**: Full functionality without authentication

## Required API Endpoints

### 1. Store API - Categories
```javascript
// Get all categories for navigation and featured sections
GET /api/store/categories/

// Query Parameters:
// - level: 0 (root categories only)
// - search: category name search
// - parent: filter by parent category

// Response Structure:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Vegetables",
      "slug": "vegetables", 
      "description": "Fresh organic vegetables",
      "parent": null,
      "level": 0,
      "image": "https://example.com/media/categories/vegetables.jpg",
      "is_active": true,
      "product_count": 45,
      "children": [
        {
          "id": 2,
          "name": "Leafy Greens",
          "slug": "leafy-greens",
          "parent": 1,
          "level": 1,
          "product_count": 12
        }
      ]
    }
  ]
}

// Implementation:
const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/api/store/categories/', {
      params: {
        level: 0,
        ordering: 'name'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return fallbackCategories;
  }
};
```

### 2. Store API - Featured Products
```javascript
// Get featured products for homepage showcase
GET /api/store/products/

// Query Parameters:
// - featured: true
// - in_stock: true
// - ordering: -created_at
// - page_size: 8

// Response Structure:
{
  "success": true,
  "data": {
    "count": 150,
    "results": [
      {
        "id": 1,
        "name": "Organic Tomatoes",
        "slug": "organic-tomatoes",
        "sku": "ORG-TOM-001",
        "description": "Fresh organic tomatoes grown locally",
        "short_description": "Juicy, pesticide-free tomatoes",
        "price": "45.99",
        "sale_price": "39.99",
        "currency": "ZAR",
        "category": {
          "id": 1,
          "name": "Vegetables",
          "slug": "vegetables"
        },
        "brand": {
          "id": 1,
          "name": "Local Farms",
          "slug": "local-farms"
        },
        "images": [
          {
            "id": 1,
            "image": "https://example.com/media/products/tomatoes-1.jpg",
            "alt_text": "Fresh organic tomatoes",
            "is_primary": true
          }
        ],
        "stock_quantity": 25,
        "is_active": true,
        "is_featured": true,
        "weight": "1.0",
        "meta_title": "Organic Tomatoes - Fresh Local Produce",
        "meta_description": "Buy fresh organic tomatoes online...",
        "created_at": "2024-12-01T10:00:00Z"
      }
    ]
  }
}

// Implementation:
const fetchFeaturedProducts = async (limit = 8) => {
  try {
    const response = await axiosInstance.get('/api/store/products/', {
      params: {
        featured: true,
        in_stock: true,
        ordering: '-created_at',
        page_size: limit
      }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return fallbackProducts;
  }
};
```

### 3. Store API - Product Search
```javascript
// Search products for search functionality
GET /api/store/products/search/

// Query Parameters:
// - q: search query
// - category: category filter
// - price_range: price filter
// - sort: relevance, price_asc, price_desc

// Implementation:
const searchProducts = async (query, filters = {}) => {
  try {
    const response = await axiosInstance.get('/api/store/products/search/', {
      params: {
        q: query,
        ...filters
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Product search failed:', error);
    return { results: [], total_results: 0 };
  }
};
```

### 4. SEO Management API - Dashboard Data
```javascript
// Get SEO metrics for performance tracking
GET /api/seo/dashboard/overview-data/

// Note: Requires superuser authentication
// Fallback: Use static SEO data if not available

// Response Structure:
{
  "success": true,
  "data": {
    "google_integration": {
      "search_console": {
        "total_clicks": 15847,
        "total_impressions": 456789,
        "avg_ctr": 3.47,
        "avg_position": 8.2
      }
    }
  }
}

// Implementation:
const fetchSEOData = async () => {
  try {
    // Only attempt if user has superuser privileges
    if (user?.role === 'admin') {
      const response = await axiosInstance.get('/api/seo/dashboard/overview-data/');
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('SEO data fetch failed:', error);
    return null;
  }
};
```

### 5. Reviews API - Product Ratings
```javascript
// Get product rating summaries
GET /api/store/products/{id}/rating-summary/

// Response Structure:
{
  "success": true,
  "data": {
    "average_rating": 4.3,
    "total_reviews": 127,
    "rating_distribution": {
      "5": 65,
      "4": 32,
      "3": 18,
      "2": 8,
      "1": 4
    }
  }
}

// Implementation:
const fetchProductRating = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/store/products/${productId}/rating-summary/`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch product rating:', error);
    return { average_rating: 0, total_reviews: 0 };
  }
};
```

## Data Flow Architecture

### Landing Page Data Loading
```javascript
// Main data loading strategy for landing page
const LandingPageDataProvider = ({ children }) => {
  const [pageData, setPageData] = useState({
    categories: [],
    featuredProducts: [],
    seoData: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadPageData = async () => {
      setPageData(prev => ({ ...prev, loading: true }));
      
      try {
        // Load data in parallel for better performance
        const [categories, products, seoData] = await Promise.allSettled([
          fetchCategories(),
          fetchFeaturedProducts(8),
          fetchSEOData()
        ]);

        setPageData({
          categories: categories.status === 'fulfilled' ? categories.value : fallbackCategories,
          featuredProducts: products.status === 'fulfilled' ? products.value : fallbackProducts,
          seoData: seoData.status === 'fulfilled' ? seoData.value : null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to load page data:', error);
        setPageData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load page data'
        }));
      }
    };

    loadPageData();
  }, []);

  return (
    <PageDataContext.Provider value={pageData}>
      {children}
    </PageDataContext.Provider>
  );
};
```

### Caching Strategy
```javascript
// Implement caching for better performance
const CacheManager = {
  cache: new Map(),
  
  set(key, data, ttl = 300000) { // 5 minutes default TTL
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  },
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  clear() {
    this.cache.clear();
  }
};

// Cached API calls
const fetchCategoriesWithCache = async () => {
  const cacheKey = 'categories';
  const cached = CacheManager.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const data = await fetchCategories();
  CacheManager.set(cacheKey, data, 600000); // 10 minutes cache
  return data;
};
```

## Fallback Data Strategies

### Static Fallback Categories
```javascript
const fallbackCategories = [
  {
    id: 1,
    name: "Vegetables",
    slug: "vegetables",
    description: "Fresh organic vegetables",
    image: "/images/categories/vegetables-fallback.jpg",
    product_count: 45,
    is_active: true
  },
  {
    id: 2,
    name: "Fruits",
    slug: "fruits", 
    description: "Seasonal fresh fruits",
    image: "/images/categories/fruits-fallback.jpg",
    product_count: 32,
    is_active: true
  },
  {
    id: 3,
    name: "Herbs",
    slug: "herbs",
    description: "Aromatic fresh herbs",
    image: "/images/categories/herbs-fallback.jpg",
    product_count: 18,
    is_active: true
  },
  {
    id: 4,
    name: "Dairy",
    slug: "dairy",
    description: "Local farm dairy products",
    image: "/images/categories/dairy-fallback.jpg",
    product_count: 24,
    is_active: true
  }
];
```

### Static Fallback Products
```javascript
const fallbackProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    slug: "organic-tomatoes",
    description: "Fresh organic tomatoes grown locally without pesticides",
    short_description: "Juicy, pesticide-free tomatoes",
    price: "45.99",
    sale_price: "39.99",
    currency: "ZAR",
    category: { name: "Vegetables", slug: "vegetables" },
    images: [
      {
        image: "/images/products/tomatoes-fallback.jpg",
        alt_text: "Fresh organic tomatoes",
        is_primary: true
      }
    ],
    stock_quantity: 25,
    is_featured: true,
    average_rating: 4.8,
    review_count: 89
  },
  {
    id: 2,
    name: "Fresh Spinach",
    slug: "fresh-spinach",
    description: "Nutrient-rich fresh spinach leaves",
    short_description: "Iron-rich leafy greens",
    price: "32.50",
    currency: "ZAR",
    category: { name: "Vegetables", slug: "vegetables" },
    images: [
      {
        image: "/images/products/spinach-fallback.jpg",
        alt_text: "Fresh spinach leaves",
        is_primary: true
      }
    ],
    stock_quantity: 18,
    is_featured: true,
    average_rating: 4.9,
    review_count: 67
  }
];
```

## Error Handling & Loading States

### API Error Handling
```javascript
// Centralized error handling for API calls
const apiErrorHandler = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  // Log error for monitoring
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    errorTracker.captureException(error);
  }
  
  // Return fallback data or empty state
  return fallbackData || [];
};

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
```

### Loading State Components
```jsx
// Loading skeleton for categories
const CategorySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-300 h-32 rounded-lg mb-2"></div>
        <div className="bg-gray-300 h-4 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

// Loading skeleton for products
const ProductSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div className="bg-gray-300 h-4 rounded w-full mb-2"></div>
        <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);
```

## Performance Optimization

### Lazy Loading Strategy
```javascript
// Lazy load non-critical data
const useLazyData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, loadData };
};

// Usage for product ratings (load on demand)
const ProductCard = ({ product }) => {
  const { data: rating, loadData: loadRating } = useLazyData(
    () => fetchProductRating(product.id),
    [product.id]
  );

  useEffect(() => {
    // Load rating when component becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadRating();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [loadRating]);

  return (
    <div ref={cardRef}>
      {/* Product card content */}
      {rating && (
        <div className="rating">
          ⭐ {rating.average_rating} ({rating.total_reviews})
        </div>
      )}
    </div>
  );
};
```

### Data Prefetching
```javascript
// Prefetch data for better UX
const prefetchCategoryProducts = async (categorySlug) => {
  try {
    const response = await axiosInstance.get('/api/store/products/', {
      params: {
        category: categorySlug,
        page_size: 12
      }
    });
    
    // Cache the prefetched data
    CacheManager.set(`category-${categorySlug}`, response.data.data.results);
  } catch (error) {
    console.error('Prefetch failed:', error);
  }
};

// Prefetch on category hover
const CategoryCard = ({ category }) => {
  const handleMouseEnter = () => {
    prefetchCategoryProducts(category.slug);
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* Category card content */}
    </div>
  );
};
```

## Integration Testing

### API Mock Data
```javascript
// Mock data for development and testing
const mockApiResponses = {
  categories: {
    success: true,
    data: fallbackCategories
  },
  
  products: {
    success: true,
    data: {
      count: 8,
      results: fallbackProducts
    }
  },
  
  seoData: {
    success: true,
    data: {
      google_integration: {
        search_console: {
          total_clicks: 1500,
          total_impressions: 45000,
          avg_ctr: 3.3,
          avg_position: 8.5
        }
      }
    }
  }
};

// Development mode API interceptor
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API) {
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const url = error.config.url;
      
      if (url.includes('/categories/')) {
        return Promise.resolve({ data: mockApiResponses.categories });
      }
      
      if (url.includes('/products/')) {
        return Promise.resolve({ data: mockApiResponses.products });
      }
      
      return Promise.reject(error);
    }
  );
}
```

## Security Considerations

### API Security
```javascript
// Secure API configuration
const secureAxiosConfig = {
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// Rate limiting awareness
const rateLimitedRequest = async (apiCall) => {
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
```

### Data Validation
```javascript
// Validate API responses
const validateCategoryData = (data) => {
  return data && Array.isArray(data) && data.every(category => 
    category.id && 
    category.name && 
    category.slug &&
    typeof category.is_active === 'boolean'
  );
};

const validateProductData = (data) => {
  return data && Array.isArray(data.results) && data.results.every(product =>
    product.id &&
    product.name &&
    product.price &&
    product.images && Array.isArray(product.images)
  );
};
```

## Monitoring & Analytics

### API Performance Tracking
```javascript
// Track API performance
const trackApiPerformance = (endpoint, startTime, success) => {
  const duration = Date.now() - startTime;
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', 'api_call', {
      endpoint,
      duration,
      success,
      custom_map: {
        metric1: duration
      }
    });
  }
};

// Usage in API calls
const fetchWithTracking = async (endpoint, fetchFunction) => {
  const startTime = Date.now();
  
  try {
    const result = await fetchFunction();
    trackApiPerformance(endpoint, startTime, true);
    return result;
  } catch (error) {
    trackApiPerformance(endpoint, startTime, false);
    throw error;
  }
};
```
