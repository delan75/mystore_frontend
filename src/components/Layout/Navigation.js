import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { prefetchData } from '../../services/landingPageService';
import './Navigation.css';

const Navigation = ({ categories = [], className = '' }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  // Handle dropdown interactions
  const handleMouseEnter = (categoryId, categorySlug) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    
    setActiveDropdown(categoryId);
    setHoveredCategory(categorySlug);
    
    // Prefetch category products on hover
    if (categorySlug) {
      prefetchData('category_products', { categorySlug });
    }
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredCategory(null);
    }, 150); // Small delay to prevent flickering
  };

  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  // Main navigation items
  const mainNavItems = [
    { name: 'Home', path: '/', icon: 'fas fa-home' },
    { name: 'Shop', path: '/shop', icon: 'fas fa-shopping-basket' },
    { name: 'About', path: '/about', icon: 'fas fa-leaf' },
    { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' }
  ];

  const navClasses = [
    'navigation',
    className
  ].filter(Boolean).join(' ');

  return (
    <ul className={navClasses} role="menubar">
      {/* Main navigation items */}
      {mainNavItems.map((item) => (
        <li key={item.path} className="navigation__item" role="none">
          <Link
            to={item.path}
            className={`navigation__link ${location.pathname === item.path ? 'navigation__link--active' : ''}`}
            role="menuitem"
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <i className={`${item.icon} navigation__icon`} aria-hidden="true"></i>
            <span>{item.name}</span>
          </Link>
        </li>
      ))}

      {/* Categories dropdown */}
      {categories.length > 0 && (
        <li 
          className="navigation__item navigation__item--dropdown"
          role="none"
          onMouseEnter={() => handleMouseEnter('categories', null)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`navigation__link navigation__link--dropdown ${activeDropdown === 'categories' ? 'navigation__link--active' : ''}`}
            role="menuitem"
            aria-expanded={activeDropdown === 'categories'}
            aria-haspopup="true"
            onKeyDown={(e) => handleKeyDown(e, 'categories')}
          >
            <i className="fas fa-tags navigation__icon" aria-hidden="true"></i>
            <span>Categories</span>
            <i className="fas fa-chevron-down navigation__dropdown-icon" aria-hidden="true"></i>
          </button>

          {/* Categories dropdown menu */}
          <div 
            className={`navigation__dropdown ${activeDropdown === 'categories' ? 'navigation__dropdown--open' : ''}`}
            role="menu"
            aria-label="Product categories"
          >
            <div className="navigation__dropdown-content">
              <div className="navigation__dropdown-header">
                <h3 className="navigation__dropdown-title">Shop by Category</h3>
                <p className="navigation__dropdown-subtitle">Fresh organic products</p>
              </div>
              
              <div className="navigation__dropdown-grid">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="navigation__dropdown-item"
                    role="menuitem"
                    onMouseEnter={() => setHoveredCategory(category.slug)}
                  >
                    <div className="navigation__dropdown-item-icon">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="navigation__dropdown-item-image"
                        />
                      ) : (
                        <i className="fas fa-leaf" aria-hidden="true"></i>
                      )}
                    </div>
                    <div className="navigation__dropdown-item-content">
                      <h4 className="navigation__dropdown-item-name">{category.name}</h4>
                      <p className="navigation__dropdown-item-count">
                        {category.product_count || 0} products
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {categories.length > 8 && (
                <div className="navigation__dropdown-footer">
                  <Link 
                    to="/categories" 
                    className="navigation__dropdown-view-all"
                    role="menuitem"
                  >
                    View All Categories
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </li>
      )}

      {/* Special offers */}
      <li className="navigation__item navigation__item--highlight" role="none">
        <Link
          to="/offers"
          className="navigation__link navigation__link--highlight"
          role="menuitem"
        >
          <i className="fas fa-fire navigation__icon" aria-hidden="true"></i>
          <span>Special Offers</span>
          <span className="navigation__badge">New</span>
        </Link>
      </li>
    </ul>
  );
};

Navigation.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string,
      product_count: PropTypes.number
    })
  ),
  className: PropTypes.string
};

Navigation.defaultProps = {
  categories: []
};

export default Navigation;
