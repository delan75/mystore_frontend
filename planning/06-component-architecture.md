# Component Architecture

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**Status**: Planning Phase

## Architecture Overview

### Component Hierarchy
```
LandingPage
├── SEOHead (Meta tags, structured data)
├── Header
│   ├── Logo
│   ├── Navigation
│   │   ├── NavigationMenu (desktop)
│   │   └── MobileMenu (mobile hamburger)
│   ├── SearchBar
│   └── UserActions (login, cart)
├── HeroSection
│   ├── HeroContent
│   ├── HeroImage
│   └── TrustIndicators
├── FeaturedCategories
│   ├── SectionHeader
│   ├── CategoryGrid
│   │   └── CategoryCard[]
│   └── ViewAllButton
├── FeaturedProducts
│   ├── SectionHeader
│   ├── ProductGrid
│   │   └── ProductCard[]
│   └── ViewAllButton
├── ValuePropositions
│   ├── SectionHeader
│   └── ValuePropGrid
│       └── ValuePropCard[]
├── SocialProof
│   ├── TestimonialCarousel
│   │   └── TestimonialCard[]
│   └── TrustBadges
├── NewsletterSignup
│   ├── NewsletterForm
│   └── IncentiveText
└── Footer
    ├── FooterLinks
    ├── ContactInfo
    ├── SocialLinks
    └── LegalLinks
```

## Core Components

### 1. LandingPage (Main Container)
```jsx
// src/pages/LandingPage.js
import React, { Suspense } from 'react';
import { LandingPageDataProvider } from '../context/LandingPageContext';
import SEOHead from '../components/SEO/SEOHead';
import Header from '../components/Layout/Header';
import HeroSection from '../components/Landing/HeroSection';
import FeaturedCategories from '../components/Landing/FeaturedCategories';
import FeaturedProducts from '../components/Landing/FeaturedProducts';
import ValuePropositions from '../components/Landing/ValuePropositions';
import SocialProof from '../components/Landing/SocialProof';
import NewsletterSignup from '../components/Landing/NewsletterSignup';
import Footer from '../components/Layout/Footer';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const LandingPage = () => {
  return (
    <LandingPageDataProvider>
      <div className="landing-page">
        <SEOHead />
        <Header />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <HeroSection />
            <FeaturedCategories />
            <FeaturedProducts />
            <ValuePropositions />
            <SocialProof />
            <NewsletterSignup />
          </Suspense>
        </main>
        <Footer />
      </div>
    </LandingPageDataProvider>
  );
};

export default LandingPage;
```

### 2. Header Component
```jsx
// src/components/Layout/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__content">
          {/* Mobile menu button */}
          <button 
            className="header__mobile-toggle md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <Navigation className="hidden md:flex" />

          {/* Search Bar */}
          <SearchBar className="hidden md:block" />

          {/* User Actions */}
          <UserActions />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
```

### 3. CategoryCard Component
```jsx
// src/components/Landing/CategoryCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../UI/OptimizedImage';

const CategoryCard = ({ category, className = '' }) => {
  const {
    id,
    name,
    slug,
    description,
    image,
    product_count
  } = category;

  return (
    <Link 
      to={`/categories/${slug}`}
      className={`category-card ${className}`}
      aria-label={`Browse ${name} category`}
    >
      <div className="category-card__image">
        <OptimizedImage
          src={image}
          alt={`${name} category`}
          width={300}
          height={300}
          className="category-card__img"
        />
        <div className="category-card__overlay">
          <span className="category-card__count">
            {product_count} products
          </span>
        </div>
      </div>
      
      <div className="category-card__content">
        <h3 className="category-card__title">{name}</h3>
        {description && (
          <p className="category-card__description">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
```

### 4. ProductCard Component
```jsx
// src/components/Landing/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../UI/OptimizedImage';
import PriceDisplay from '../UI/PriceDisplay';
import RatingDisplay from '../UI/RatingDisplay';
import AddToCartButton from '../UI/AddToCartButton';

const ProductCard = ({ product, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const {
    id,
    name,
    slug,
    short_description,
    price,
    sale_price,
    currency,
    images,
    stock_quantity,
    average_rating,
    review_count
  } = product;

  const primaryImage = images?.find(img => img.is_primary) || images?.[0];

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  return (
    <div className={`product-card ${className}`}>
      <div className="product-card__image-container">
        <Link to={`/products/${slug}`}>
          <OptimizedImage
            src={primaryImage?.image}
            alt={primaryImage?.alt_text || name}
            width={400}
            height={400}
            className="product-card__image"
          />
        </Link>
        
        <button
          className={`product-card__wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
        >
          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
        </button>

        {sale_price && (
          <span className="product-card__badge">Sale</span>
        )}
      </div>

      <div className="product-card__content">
        <Link to={`/products/${slug}`}>
          <h3 className="product-card__title">{name}</h3>
        </Link>
        
        {short_description && (
          <p className="product-card__description">{short_description}</p>
        )}

        {(average_rating || review_count) && (
          <RatingDisplay 
            rating={average_rating}
            reviewCount={review_count}
            className="product-card__rating"
          />
        )}

        <div className="product-card__footer">
          <PriceDisplay
            price={price}
            salePrice={sale_price}
            currency={currency}
            className="product-card__price"
          />

          <AddToCartButton
            productId={id}
            stockQuantity={stock_quantity}
            className="product-card__add-to-cart"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
```

## Utility Components

### 1. OptimizedImage Component
```jsx
// src/components/UI/OptimizedImage.js
import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  loading = 'lazy',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Generate responsive image URLs
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    const baseUrl = baseSrc.split('.').slice(0, -1).join('.');
    const extension = baseSrc.split('.').pop();
    
    return [
      `${baseUrl}_400w.${extension} 400w`,
      `${baseUrl}_800w.${extension} 800w`,
      `${baseUrl}_1200w.${extension} 1200w`
    ].join(', ');
  };

  if (imageError || !src) {
    return (
      <div 
        className={`image-placeholder ${className}`}
        style={{ width, height, aspectRatio: `${width}/${height}` }}
      >
        <i className="fas fa-image text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className={`optimized-image ${className}`}>
      {!imageLoaded && (
        <div 
          className="image-skeleton"
          style={{ width, height, aspectRatio: `${width}/${height}` }}
        />
      )}
      
      <picture>
        <source 
          srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png)$/, '.webp'))}
          type="image/webp"
        />
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            aspectRatio: `${width}/${height}`,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          {...props}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
```

### 2. SectionHeader Component
```jsx
// src/components/UI/SectionHeader.js
import React from 'react';

const SectionHeader = ({ 
  title, 
  subtitle, 
  description,
  alignment = 'center',
  className = '' 
}) => {
  return (
    <div className={`section-header section-header--${alignment} ${className}`}>
      {subtitle && (
        <span className="section-header__subtitle">{subtitle}</span>
      )}
      
      <h2 className="section-header__title">{title}</h2>
      
      {description && (
        <p className="section-header__description">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
```

### 3. LoadingSpinner Component
```jsx
// src/components/UI/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-green ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;
```

## Context Providers

### 1. LandingPageContext
```jsx
// src/context/LandingPageContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCategories, fetchFeaturedProducts, fetchSEOData } from '../services/landingPageService';

const LandingPageContext = createContext();

const initialState = {
  categories: [],
  featuredProducts: [],
  seoData: null,
  loading: true,
  error: null
};

const landingPageReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, loading: true, error: null };
    
    case 'LOADING_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    
    case 'LOADING_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export const LandingPageDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(landingPageReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'LOADING_START' });
      
      try {
        const [categories, products, seoData] = await Promise.allSettled([
          fetchCategories(),
          fetchFeaturedProducts(),
          fetchSEOData()
        ]);

        dispatch({
          type: 'LOADING_SUCCESS',
          payload: {
            categories: categories.status === 'fulfilled' ? categories.value : [],
            featuredProducts: products.status === 'fulfilled' ? products.value : [],
            seoData: seoData.status === 'fulfilled' ? seoData.value : null
          }
        });
      } catch (error) {
        dispatch({
          type: 'LOADING_ERROR',
          payload: error.message
        });
      }
    };

    loadData();
  }, []);

  return (
    <LandingPageContext.Provider value={state}>
      {children}
    </LandingPageContext.Provider>
  );
};

export const useLandingPageData = () => {
  const context = useContext(LandingPageContext);
  if (!context) {
    throw new Error('useLandingPageData must be used within LandingPageDataProvider');
  }
  return context;
};
```

## Service Layer

### 1. Landing Page Service
```jsx
// src/services/landingPageService.js
import axiosInstance from '../utils/axios';
import { fallbackCategories, fallbackProducts } from '../data/fallbackData';

export const fetchCategories = async () => {
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

export const fetchFeaturedProducts = async (limit = 8) => {
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
    return fallbackProducts.slice(0, limit);
  }
};

export const fetchSEOData = async () => {
  try {
    const response = await axiosInstance.get('/api/seo/dashboard/overview-data/');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch SEO data:', error);
    return null;
  }
};
```

## Styling Architecture

### 1. Component Styles Structure
```
src/styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── Header.css
│   ├── CategoryCard.css
│   ├── ProductCard.css
│   └── Button.css
├── layout/
│   ├── grid.css
│   ├── container.css
│   └── spacing.css
├── pages/
│   └── LandingPage.css
└── utilities/
    ├── animations.css
    └── helpers.css
```

### 2. CSS Custom Properties
```css
/* src/styles/base/variables.css */
:root {
  /* Colors */
  --color-primary: #2D5A27;
  --color-accent: #1ab188;
  --color-background: #FFFFFF;
  --color-text: #343A40;
  
  /* Typography */
  --font-primary: 'Titillium Web', sans-serif;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## Testing Strategy

### 1. Component Testing
```jsx
// src/components/__tests__/CategoryCard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryCard from '../Landing/CategoryCard';

const mockCategory = {
  id: 1,
  name: 'Vegetables',
  slug: 'vegetables',
  description: 'Fresh organic vegetables',
  image: '/images/vegetables.jpg',
  product_count: 45
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CategoryCard', () => {
  test('renders category information correctly', () => {
    renderWithRouter(<CategoryCard category={mockCategory} />);
    
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
    expect(screen.getByText('Fresh organic vegetables')).toBeInTheDocument();
    expect(screen.getByText('45 products')).toBeInTheDocument();
  });

  test('links to correct category page', () => {
    renderWithRouter(<CategoryCard category={mockCategory} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/categories/vegetables');
  });
});
```

## Performance Considerations

### 1. Code Splitting
```jsx
// Lazy load non-critical components
const SocialProof = React.lazy(() => import('../components/Landing/SocialProof'));
const NewsletterSignup = React.lazy(() => import('../components/Landing/NewsletterSignup'));

// Use in component
<Suspense fallback={<LoadingSpinner />}>
  <SocialProof />
  <NewsletterSignup />
</Suspense>
```

### 2. Memoization
```jsx
// Memoize expensive components
const CategoryCard = React.memo(({ category }) => {
  // Component implementation
});

const ProductCard = React.memo(({ product }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.product.id === nextProps.product.id;
});
```

## Accessibility Features

### 1. Keyboard Navigation
```jsx
// Implement proper keyboard navigation
const CategoryCard = ({ category }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Navigate to category
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Browse ${category.name} category`}
    >
      {/* Card content */}
    </div>
  );
};
```

### 2. Screen Reader Support
```jsx
// Add proper ARIA labels and descriptions
const ProductCard = ({ product }) => {
  return (
    <article 
      className="product-card"
      aria-labelledby={`product-${product.id}-title`}
      aria-describedby={`product-${product.id}-description`}
    >
      <h3 id={`product-${product.id}-title`}>{product.name}</h3>
      <p id={`product-${product.id}-description`}>{product.description}</p>
      
      <button 
        aria-label={`Add ${product.name} to cart`}
        aria-describedby={`product-${product.id}-price`}
      >
        Add to Cart
      </button>
    </article>
  );
};
```

## Next Steps

1. **Implement base components** (OptimizedImage, SectionHeader, LoadingSpinner)
2. **Create layout components** (Header, Footer)
3. **Build landing page sections** (Hero, Categories, Products)
4. **Set up context providers** and data fetching
5. **Add styling** with CSS modules or styled-components
6. **Implement responsive design** and mobile optimizations
7. **Add accessibility features** and keyboard navigation
8. **Write component tests** and integration tests
