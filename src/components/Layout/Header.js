import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLandingPageData } from '../../context/LandingPageContext';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { categories } = useLandingPageData();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    if (mobileMenuOpen || searchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    setMobileMenuOpen(false);
  };

  const headerClasses = [
    'header',
    isScrolled ? 'header--scrolled' : '',
    mobileMenuOpen ? 'header--menu-open' : '',
    searchOpen ? 'header--search-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClasses} role="banner">
        <div className="container">
          <div className="header__content">
            {/* Mobile menu button */}
            <button 
              className="header__mobile-toggle"
              onClick={handleMobileMenuToggle}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="header__hamburger">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            {/* Logo */}
            <div className="header__logo">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="header__nav" role="navigation" aria-label="Main navigation">
              <Navigation categories={categories} />
            </nav>

            {/* Search Bar - Desktop */}
            <div className="header__search">
              <SearchBar 
                className="header__search-bar"
                placeholder="Search fresh products..."
              />
            </div>

            {/* User Actions */}
            <div className="header__actions">
              {/* Mobile search toggle */}
              <button 
                className="header__search-toggle"
                onClick={handleSearchToggle}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                <i className="fas fa-search"></i>
              </button>

              <UserActions />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className={`header__mobile-search ${searchOpen ? 'header__mobile-search--open' : ''}`}>
            <SearchBar 
              placeholder="Search fresh products..."
              autoFocus={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />

      {/* Backdrop */}
      {(mobileMenuOpen || searchOpen) && (
        <div 
          className="header__backdrop"
          onClick={() => {
            setMobileMenuOpen(false);
            setSearchOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Header;
