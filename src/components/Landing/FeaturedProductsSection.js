import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import SectionHeader from '../UI/SectionHeader';
import OptimizedImage from '../UI/OptimizedImage';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import './FeaturedProductsSection.css';

const FeaturedProductsSection = () => {
  const { featuredProducts, loading: dataLoading, productsError } = useLandingPageData();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Products', icon: 'fas fa-th-large' },
    { value: 'vegetables', label: 'Vegetables', icon: 'fas fa-carrot' },
    { value: 'fruits', label: 'Fruits', icon: 'fas fa-apple-alt' },
    { value: 'dairy', label: 'Dairy', icon: 'fas fa-cheese' },
    { value: 'organic', label: 'Organic', icon: 'fas fa-leaf' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = [...featuredProducts];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(product => {
        const category = product.category?.toLowerCase() || '';
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        return category.includes(filter) || tags.includes(filter);
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.sale_price || a.price) - (b.sale_price || b.price);
        case 'price-high':
          return (b.sale_price || b.price) - (a.sale_price || a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'featured':
        default:
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });

    return filtered;
  }, [featuredProducts, filter, sortBy]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleProducts);

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  // Close quick view on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };

    if (selectedProduct) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  if (productsError) {
    return (
      <section className="featured-products featured-products--error">
        <div className="container">
          <SectionHeader
            title="Featured Products"
            subtitle="Unable to load products"
            description="Please try again later or contact support if the problem persists."
          />
          <div className="featured-products__error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{productsError}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products" id="featured-products">
      <div className="container">
        <SectionHeader
          title="Featured Products"
          subtitle="Fresh from the Farm"
          description="Discover our handpicked selection of the finest organic produce, delivered fresh to your doorstep."
          alignment="center"
          showDivider={true}
        />

        {/* Filters and Sort */}
        <div className="featured-products__controls">
          {/* Filter Tabs */}
          <div className="featured-products__filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`featured-products__filter ${
                  filter === option.value ? 'featured-products__filter--active' : ''
                }`}
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
              >
                <i className={option.icon} aria-hidden="true"></i>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="featured-products__sort">
            <label htmlFor="sort-select" className="featured-products__sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              className="featured-products__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {dataLoading ? (
          <div className="featured-products__loading">
            <LoadingSpinner size="large" color="primary" text="Loading fresh products..." />
          </div>
        ) : (
          <>
            <div className="featured-products__grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleProducts < filteredAndSortedProducts.length && (
              <div className="featured-products__load-more">
                <Button
                  variant="outline"
                  size="large"
                  onClick={handleLoadMore}
                  icon="fas fa-plus"
                >
                  Load More Products ({filteredAndSortedProducts.length - visibleProducts} remaining)
                </Button>
              </div>
            )}

            {/* View All Link */}
            <div className="featured-products__view-all">
              <Button
                as={Link}
                to="/shop"
                variant="primary"
                size="large"
                icon="fas fa-store"
                iconPosition="right"
              >
                View All Products
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={closeQuickView}
        />
      )}
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, onQuickView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    setIsInWishlist(!isInWishlist);
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    onQuickView(product);
  };

  const discountPercentage = product.sale_price && product.price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug || product.id}`} className="product-card__link">
        <div className="product-card__image-container">
          <OptimizedImage
            src={product.image || '/api/placeholder/300/300'}
            alt={product.name}
            className="product-card__image"
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Badges */}
          <div className="product-card__badges">
            {product.is_featured && (
              <span className="product-card__badge product-card__badge--featured">
                <i className="fas fa-star" aria-hidden="true"></i>
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="product-card__badge product-card__badge--discount">
                -{discountPercentage}%
              </span>
            )}
            {product.tags?.includes('organic') && (
              <span className="product-card__badge product-card__badge--organic">
                <i className="fas fa-leaf" aria-hidden="true"></i>
                Organic
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="product-card__actions">
            <button
              className="product-card__action"
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <i className={`${isInWishlist ? 'fas' : 'far'} fa-heart`} aria-hidden="true"></i>
            </button>
            <button
              className="product-card__action"
              onClick={handleQuickView}
              aria-label="Quick view"
              title="Quick view"
            >
              <i className="fas fa-eye" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>
          
          {product.short_description && (
            <p className="product-card__description">
              {product.short_description}
            </p>
          )}

          <div className="product-card__meta">
            {/* Rating */}
            {product.average_rating > 0 && (
              <div className="product-card__rating">
                <div className="product-card__stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${
                        star <= product.average_rating
                          ? 'product-card__star--filled'
                          : 'product-card__star--empty'
                      }`}
                      aria-hidden="true"
                    ></i>
                  ))}
                </div>
                <span className="product-card__rating-text">
                  ({product.review_count || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-card__price">
              {product.sale_price ? (
                <>
                  <span className="product-card__price-sale">
                    {product.currency} {product.sale_price}
                  </span>
                  <span className="product-card__price-original">
                    {product.currency} {product.price}
                  </span>
                </>
              ) : (
                <span className="product-card__price-current">
                  {product.currency} {product.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="product-card__footer">
        <Button
          variant="primary"
          size="small"
          onClick={handleAddToCart}
          icon="fas fa-shopping-cart"
          className="product-card__add-to-cart"
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

// Quick View Modal Component (simplified for now)
const QuickViewModal = ({ product, onClose }) => {
  return (
    <div className="quick-view-modal" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
      <div className="quick-view-modal__overlay" onClick={onClose} />
      <div className="quick-view-modal__content">
        <button
          className="quick-view-modal__close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
        
        <div className="quick-view-modal__body">
          <div className="quick-view-modal__image">
            <OptimizedImage
              src={product.image || '/api/placeholder/400/400'}
              alt={product.name}
              sizes="400px"
            />
          </div>
          
          <div className="quick-view-modal__info">
            <h2 id="quick-view-title" className="quick-view-modal__title">
              {product.name}
            </h2>
            
            <div className="quick-view-modal__price">
              {product.sale_price ? (
                <>
                  <span className="quick-view-modal__price-sale">
                    {product.currency} {product.sale_price}
                  </span>
                  <span className="quick-view-modal__price-original">
                    {product.currency} {product.price}
                  </span>
                </>
              ) : (
                <span className="quick-view-modal__price-current">
                  {product.currency} {product.price}
                </span>
              )}
            </div>
            
            {product.description && (
              <p className="quick-view-modal__description">
                {product.description}
              </p>
            )}
            
            <div className="quick-view-modal__actions">
              <Button
                variant="primary"
                size="large"
                icon="fas fa-shopping-cart"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                as={Link}
                to={`/product/${product.slug || product.id}`}
                variant="outline"
                size="large"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;
