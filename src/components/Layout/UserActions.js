import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import placeholderAvatar from '../../assets/placeholder-avatar.svg';
import './UserActions.css';

const UserActions = () => {
  const { user, logout, loading } = useAuth();
  const history = useHistory();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      history.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileToggle = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Mock cart and wishlist counts - replace with actual data from context/API
  useEffect(() => {
    // TODO: Replace with actual cart/wishlist data
    setCartItemCount(3);
    setWishlistItemCount(5);
  }, []);

  if (loading) {
    return (
      <div className="user-actions">
        <div className="user-actions__loading">
          <div className="user-actions__skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-actions">
      {/* Wishlist */}
      <Link 
        to="/wishlist" 
        className="user-actions__item user-actions__wishlist"
        aria-label={`Wishlist (${wishlistItemCount} items)`}
        title="Wishlist"
      >
        <i className="far fa-heart" aria-hidden="true"></i>
        {wishlistItemCount > 0 && (
          <span className="user-actions__badge" aria-label={`${wishlistItemCount} items in wishlist`}>
            {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
          </span>
        )}
      </Link>

      {/* Shopping Cart */}
      <Link 
        to="/cart" 
        className="user-actions__item user-actions__cart"
        aria-label={`Shopping cart (${cartItemCount} items)`}
        title="Shopping Cart"
      >
        <i className="fas fa-shopping-cart" aria-hidden="true"></i>
        {cartItemCount > 0 && (
          <span className="user-actions__badge" aria-label={`${cartItemCount} items in cart`}>
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </Link>

      {/* User Profile / Auth */}
      {user ? (
        <div className="user-actions__profile" ref={profileDropdownRef}>
          <button
            className="user-actions__profile-trigger"
            onClick={handleProfileToggle}
            aria-label="User menu"
            aria-expanded={showProfileDropdown}
            aria-haspopup="true"
          >
            <img
              src={user.avatar || placeholderAvatar}
              alt={`${user.first_name || user.username}'s avatar`}
              className="user-actions__avatar"
              onError={(e) => {
                e.target.src = placeholderAvatar;
              }}
            />
            <span className="user-actions__username">
              {user.first_name || user.username}
            </span>
            <i className={`fas fa-chevron-down user-actions__chevron ${showProfileDropdown ? 'user-actions__chevron--open' : ''}`} aria-hidden="true"></i>
          </button>

          {showProfileDropdown && (
            <div className="user-actions__dropdown" role="menu">
              <div className="user-actions__dropdown-header">
                <img
                  src={user.avatar || placeholderAvatar}
                  alt={`${user.first_name || user.username}'s avatar`}
                  className="user-actions__dropdown-avatar"
                />
                <div className="user-actions__dropdown-info">
                  <span className="user-actions__dropdown-name">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.username
                    }
                  </span>
                  <span className="user-actions__dropdown-email">{user.email}</span>
                  {user.role && (
                    <span className="user-actions__dropdown-role">{user.role}</span>
                  )}
                </div>
              </div>

              <div className="user-actions__dropdown-divider"></div>

              <Link
                to="/dashboard"
                className="user-actions__dropdown-item"
                role="menuitem"
                onClick={() => setShowProfileDropdown(false)}
              >
                <i className="fas fa-tachometer-alt" aria-hidden="true"></i>
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="user-actions__dropdown-item"
                role="menuitem"
                onClick={() => setShowProfileDropdown(false)}
              >
                <i className="fas fa-user" aria-hidden="true"></i>
                Profile
              </Link>

              <Link
                to="/orders/my"
                className="user-actions__dropdown-item"
                role="menuitem"
                onClick={() => setShowProfileDropdown(false)}
              >
                <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                My Orders
              </Link>

              <Link
                to="/account-settings"
                className="user-actions__dropdown-item"
                role="menuitem"
                onClick={() => setShowProfileDropdown(false)}
              >
                <i className="fas fa-cog" aria-hidden="true"></i>
                Settings
              </Link>

              <div className="user-actions__dropdown-divider"></div>

              <button
                onClick={handleLogout}
                className="user-actions__dropdown-item user-actions__dropdown-item--logout"
                role="menuitem"
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="user-actions__auth">
          <Link
            to="/auth"
            className="user-actions__login"
            aria-label="Login or Register"
          >
            <i className="fas fa-user" aria-hidden="true"></i>
            <span className="user-actions__login-text">Login</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserActions;
