import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import placeholderAvatar from '../../assets/placeholder-avatar.svg';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, categories = [] }) => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  // Mock cart and wishlist counts - replace with actual data
  useEffect(() => {
    // TODO: Replace with actual cart/wishlist data
    setCartItemCount(3);
    setWishlistItemCount(5);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      history.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
      <div className="mobile-menu__overlay" onClick={onClose} aria-hidden="true" />
      
      <div className="mobile-menu__content">
        {/* Header */}
        <div className="mobile-menu__header">
          <h2 className="mobile-menu__title">Menu</h2>
          <button
            className="mobile-menu__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        {/* User Section */}
        {user ? (
          <div className="mobile-menu__user">
            <div className="mobile-menu__user-info">
              <img
                src={user.avatar || placeholderAvatar}
                alt={`${user.first_name || user.username}'s avatar`}
                className="mobile-menu__avatar"
                onError={(e) => {
                  e.target.src = placeholderAvatar;
                }}
              />
              <div className="mobile-menu__user-details">
                <span className="mobile-menu__user-name">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.username
                  }
                </span>
                <span className="mobile-menu__user-email">{user.email}</span>
                {user.role && (
                  <span className="mobile-menu__user-role">{user.role}</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mobile-menu__quick-actions">
              <Link
                to="/cart"
                className="mobile-menu__quick-action"
                onClick={handleLinkClick}
                aria-label={`Shopping cart (${cartItemCount} items)`}
              >
                <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="mobile-menu__badge">{cartItemCount}</span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="mobile-menu__quick-action"
                onClick={handleLinkClick}
                aria-label={`Wishlist (${wishlistItemCount} items)`}
              >
                <i className="far fa-heart" aria-hidden="true"></i>
                <span>Wishlist</span>
                {wishlistItemCount > 0 && (
                  <span className="mobile-menu__badge">{wishlistItemCount}</span>
                )}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mobile-menu__auth">
            <Link
              to="/auth"
              className="mobile-menu__auth-button"
              onClick={handleLinkClick}
            >
              <i className="fas fa-user" aria-hidden="true"></i>
              Login / Register
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="mobile-menu__nav" role="navigation" aria-label="Mobile navigation">
          {/* Main Links */}
          <div className="mobile-menu__section">
            <Link
              to="/"
              className="mobile-menu__link"
              onClick={handleLinkClick}
            >
              <i className="fas fa-home" aria-hidden="true"></i>
              Home
            </Link>

            <Link
              to="/shop"
              className="mobile-menu__link"
              onClick={handleLinkClick}
            >
              <i className="fas fa-store" aria-hidden="true"></i>
              Shop
            </Link>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mobile-menu__section">
              <h3 className="mobile-menu__section-title">Categories</h3>
              {categories.map((category) => (
                <div key={category.id} className="mobile-menu__category">
                  <button
                    className="mobile-menu__category-toggle"
                    onClick={() => handleCategoryToggle(category.id)}
                    aria-expanded={expandedCategory === category.id}
                    aria-controls={`category-${category.id}`}
                  >
                    <span className="mobile-menu__category-name">
                      {category.name}
                    </span>
                    <i 
                      className={`fas fa-chevron-down mobile-menu__category-chevron ${
                        expandedCategory === category.id ? 'mobile-menu__category-chevron--open' : ''
                      }`} 
                      aria-hidden="true"
                    ></i>
                  </button>

                  {expandedCategory === category.id && category.subcategories && (
                    <div 
                      className="mobile-menu__subcategories"
                      id={`category-${category.id}`}
                    >
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/shop/category/${subcategory.slug}`}
                          className="mobile-menu__subcategory-link"
                          onClick={handleLinkClick}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/shop/category/${category.slug}`}
                    className="mobile-menu__category-link"
                    onClick={handleLinkClick}
                  >
                    View All {category.name}
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* User Menu (when logged in) */}
          {user && (
            <div className="mobile-menu__section">
              <h3 className="mobile-menu__section-title">Account</h3>
              
              <Link
                to="/dashboard"
                className="mobile-menu__link"
                onClick={handleLinkClick}
              >
                <i className="fas fa-tachometer-alt" aria-hidden="true"></i>
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="mobile-menu__link"
                onClick={handleLinkClick}
              >
                <i className="fas fa-user" aria-hidden="true"></i>
                Profile
              </Link>

              <Link
                to="/orders/my"
                className="mobile-menu__link"
                onClick={handleLinkClick}
              >
                <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                My Orders
              </Link>

              <Link
                to="/account-settings"
                className="mobile-menu__link"
                onClick={handleLinkClick}
              >
                <i className="fas fa-cog" aria-hidden="true"></i>
                Settings
              </Link>
            </div>
          )}

          {/* Support Links */}
          <div className="mobile-menu__section">
            <h3 className="mobile-menu__section-title">Support</h3>
            
            <Link
              to="/support"
              className="mobile-menu__link"
              onClick={handleLinkClick}
            >
              <i className="fas fa-question-circle" aria-hidden="true"></i>
              Help & Support
            </Link>

            <Link
              to="/feedback"
              className="mobile-menu__link"
              onClick={handleLinkClick}
            >
              <i className="fas fa-comment" aria-hidden="true"></i>
              Feedback
            </Link>
          </div>

          {/* Logout (when logged in) */}
          {user && (
            <div className="mobile-menu__section">
              <button
                onClick={handleLogout}
                className="mobile-menu__link mobile-menu__link--logout"
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
