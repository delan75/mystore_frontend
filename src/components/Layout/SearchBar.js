import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { searchProducts } from '../../services/landingPageService';
import LoadingSpinner from '../UI/LoadingSpinner';
import './SearchBar.css';

const SearchBar = ({ 
  placeholder = 'Search products...',
  className = '',
  autoFocus = false,
  onClose,
  showSuggestions = true,
  ...props 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const history = useHistory();

  // Auto focus when requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search function
  const debouncedSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || !showSuggestions) return;

    setIsLoading(true);
    try {
      const results = await searchProducts(searchQuery, { page_size: 5 });
      setSuggestions(results.results || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search suggestions failed:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [showSuggestions]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        debouncedSearch(value);
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  // Perform search and navigate
  const performSearch = (searchQuery) => {
    setShowDropdown(false);
    setQuery('');
    onClose?.();
    history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      history.push(`/products/${suggestion.slug}`);
    } else {
      performSearch(suggestion.name);
    }
    setShowDropdown(false);
    setQuery('');
    onClose?.();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          performSearch(query.trim());
        }
        break;
      
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        if (onClose) {
          onClose();
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const searchBarClasses = [
    'search-bar',
    showDropdown ? 'search-bar--dropdown-open' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={searchBarClasses} {...props}>
      <form onSubmit={handleSubmit} className="search-bar__form" role="search">
        <div className="search-bar__input-wrapper">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            placeholder={placeholder}
            className="search-bar__input"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-activedescendant={
              selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
            }
            autoComplete="off"
            spellCheck="false"
          />
          
          <button
            type="submit"
            className="search-bar__submit"
            aria-label="Search"
            disabled={!query.trim()}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <i className="fas fa-search" aria-hidden="true"></i>
            )}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="search-bar__close"
              aria-label="Close search"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          )}
        </div>

        {/* Search suggestions dropdown */}
        {showDropdown && showSuggestions && (
          <div 
            ref={dropdownRef}
            className="search-bar__dropdown"
            role="listbox"
            aria-label="Search suggestions"
          >
            {isLoading ? (
              <div className="search-bar__loading">
                <LoadingSpinner size="small" color="primary" />
                <span>Searching...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="search-bar__suggestions">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.id}-${index}`}
                      id={`suggestion-${index}`}
                      className={`search-bar__suggestion ${
                        index === selectedIndex ? 'search-bar__suggestion--selected' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="search-bar__suggestion-icon">
                        {suggestion.images?.[0]?.image ? (
                          <img 
                            src={suggestion.images[0].image} 
                            alt={suggestion.name}
                            className="search-bar__suggestion-image"
                          />
                        ) : (
                          <i className="fas fa-search" aria-hidden="true"></i>
                        )}
                      </div>
                      <div className="search-bar__suggestion-content">
                        <span className="search-bar__suggestion-name">
                          {suggestion.name}
                        </span>
                        {suggestion.price && (
                          <span className="search-bar__suggestion-price">
                            {suggestion.currency} {suggestion.sale_price || suggestion.price}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="search-bar__dropdown-footer">
                  <button
                    className="search-bar__view-all"
                    onClick={() => performSearch(query)}
                  >
                    View all results for "{query}"
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
              </>
            ) : query.length >= 2 ? (
              <div className="search-bar__no-results">
                <i className="fas fa-search" aria-hidden="true"></i>
                <span>No products found for "{query}"</span>
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  onClose: PropTypes.func,
  showSuggestions: PropTypes.bool
};

SearchBar.defaultProps = {
  placeholder: 'Search products...',
  autoFocus: false,
  showSuggestions: true
};

export default SearchBar;
