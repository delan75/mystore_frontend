import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import SectionHeader from '../UI/SectionHeader';
import OptimizedImage from '../UI/OptimizedImage';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const { categories, loading: dataLoading, categoriesError } = useLandingPageData();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Fallback categories if none from backend
  const fallbackCategories = [
    {
      id: 'vegetables',
      name: 'Fresh Vegetables',
      description: 'Crisp, organic vegetables harvested daily from local farms',
      image: '/api/placeholder/400/300',
      product_count: 45,
      icon: 'fas fa-carrot',
      color: '#4A7C59',
      featured_products: ['Organic Tomatoes', 'Fresh Lettuce', 'Bell Peppers']
    },
    {
      id: 'fruits',
      name: 'Seasonal Fruits',
      description: 'Sweet, juicy fruits picked at peak ripeness',
      image: '/api/placeholder/400/300',
      product_count: 32,
      icon: 'fas fa-apple-alt',
      color: '#FF6347',
      featured_products: ['Red Apples', 'Fresh Berries', 'Citrus Fruits']
    },
    {
      id: 'dairy',
      name: 'Farm Dairy',
      description: 'Fresh dairy products from grass-fed, happy cows',
      image: '/api/placeholder/400/300',
      product_count: 18,
      icon: 'fas fa-cheese',
      color: '#FFD700',
      featured_products: ['Fresh Milk', 'Artisan Cheese', 'Farm Butter']
    },
    {
      id: 'herbs',
      name: 'Fresh Herbs',
      description: 'Aromatic herbs and spices grown in our greenhouse',
      image: '/api/placeholder/400/300',
      product_count: 24,
      icon: 'fas fa-leaf',
      color: '#90EE90',
      featured_products: ['Basil', 'Rosemary', 'Thyme']
    },
    {
      id: 'grains',
      name: 'Whole Grains',
      description: 'Nutritious, organic grains and legumes',
      image: '/api/placeholder/400/300',
      product_count: 15,
      icon: 'fas fa-seedling',
      color: '#8B4513',
      featured_products: ['Quinoa', 'Brown Rice', 'Lentils']
    },
    {
      id: 'preserves',
      name: 'Artisan Preserves',
      description: 'Homemade jams, pickles, and preserved goods',
      image: '/api/placeholder/400/300',
      product_count: 12,
      icon: 'fas fa-jar',
      color: '#FF8C00',
      featured_products: ['Strawberry Jam', 'Pickled Vegetables', 'Honey']
    }
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  if (categoriesError) {
    return (
      <section className="categories categories--error">
        <div className="container">
          <SectionHeader
            title="Product Categories"
            subtitle="Unable to load categories"
            description="Please try again later or contact support if the problem persists."
          />
          <div className="categories__error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{categoriesError}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories" id="categories">
      <div className="container">
        <SectionHeader
          title="Shop by Category"
          subtitle="Farm Fresh Selection"
          description="Explore our carefully curated categories of fresh, organic produce and artisan farm products."
          alignment="center"
          showDivider={true}
        />

        {dataLoading ? (
          <div className="categories__loading">
            <LoadingSpinner size="large" color="primary" text="Loading categories..." />
          </div>
        ) : (
          <>
            {/* Main Categories Grid */}
            <div className="categories__grid">
              {displayCategories.slice(0, 6).map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  isHovered={hoveredCategory === category.id}
                  onHover={setHoveredCategory}
                />
              ))}
            </div>

            {/* Featured Categories Highlight */}
            <div className="categories__featured">
              <div className="categories__featured-content">
                <div className="categories__featured-text">
                  <h3 className="categories__featured-title">
                    Why Choose Our Categories?
                  </h3>
                  <p className="categories__featured-description">
                    Each category represents our commitment to quality, sustainability, and freshness. 
                    From farm to table, we ensure every product meets our high standards.
                  </p>
                  <div className="categories__featured-benefits">
                    <div className="categories__benefit">
                      <i className="fas fa-leaf" aria-hidden="true"></i>
                      <span>100% Organic</span>
                    </div>
                    <div className="categories__benefit">
                      <i className="fas fa-truck" aria-hidden="true"></i>
                      <span>Fresh Delivery</span>
                    </div>
                    <div className="categories__benefit">
                      <i className="fas fa-heart" aria-hidden="true"></i>
                      <span>Locally Sourced</span>
                    </div>
                  </div>
                </div>
                
                <div className="categories__featured-stats">
                  <div className="categories__stat">
                    <span className="categories__stat-number">
                      {displayCategories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)}+
                    </span>
                    <span className="categories__stat-label">Products</span>
                  </div>
                  <div className="categories__stat">
                    <span className="categories__stat-number">{displayCategories.length}</span>
                    <span className="categories__stat-label">Categories</span>
                  </div>
                  <div className="categories__stat">
                    <span className="categories__stat-number">50+</span>
                    <span className="categories__stat-label">Local Farms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Categories */}
            <div className="categories__view-all">
              <Button
                as={Link}
                to="/shop"
                variant="primary"
                size="large"
                icon="fas fa-th-large"
                iconPosition="right"
              >
                View All Categories
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ category, index, isHovered, onHover }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = () => {
    onHover(category.id);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  const cardStyle = {
    '--category-color': category.color || 'var(--color-primary-green)',
    '--animation-delay': `${index * 0.1}s`
  };

  return (
    <Link
      to={`/shop/category/${category.slug || category.id}`}
      className="category-card"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Browse ${category.name} - ${category.product_count || 0} products`}
    >
      <div className="category-card__image-container">
        <OptimizedImage
          src={category.image || '/api/placeholder/400/300'}
          alt={category.name}
          className="category-card__image"
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        <div className="category-card__overlay" />
        
        {/* Icon */}
        <div className="category-card__icon">
          <i className={category.icon || 'fas fa-leaf'} aria-hidden="true"></i>
        </div>

        {/* Product Count Badge */}
        <div className="category-card__count">
          <span className="category-card__count-number">
            {category.product_count || 0}
          </span>
          <span className="category-card__count-label">Products</span>
        </div>
      </div>

      <div className="category-card__content">
        <h3 className="category-card__title">{category.name}</h3>
        
        <p className="category-card__description">
          {category.description || 'Fresh, quality products from local farms'}
        </p>

        {/* Featured Products Preview */}
        {category.featured_products && category.featured_products.length > 0 && (
          <div className="category-card__featured">
            <span className="category-card__featured-label">Featured:</span>
            <span className="category-card__featured-items">
              {category.featured_products.slice(0, 3).join(', ')}
            </span>
          </div>
        )}

        {/* Call to Action */}
        <div className="category-card__cta">
          <span className="category-card__cta-text">Shop Now</span>
          <i className="fas fa-arrow-right category-card__cta-icon" aria-hidden="true"></i>
        </div>
      </div>

      {/* Hover Effect Elements */}
      <div className="category-card__hover-effect" />
    </Link>
  );
};

export default CategoriesSection;
