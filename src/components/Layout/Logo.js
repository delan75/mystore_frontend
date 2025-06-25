import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Logo.css';

const Logo = ({ 
  variant = 'default',
  size = 'medium',
  showText = true,
  className = '',
  ...props 
}) => {
  const logoClasses = [
    'logo',
    `logo--${variant}`,
    `logo--${size}`,
    !showText ? 'logo--icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Link 
      to="/" 
      className={logoClasses}
      aria-label="MyStore - Fresh Farm Products"
      {...props}
    >
      <div className="logo__icon">
        {/* SVG Logo Icon */}
        <svg 
          viewBox="0 0 48 48" 
          className="logo__svg"
          role="img"
          aria-labelledby="logo-title"
        >
          <title id="logo-title">MyStore Logo</title>
          
          {/* Leaf shape */}
          <path 
            d="M24 4C16 4 10 10 10 18C10 26 16 32 24 40C32 32 38 26 38 18C38 10 32 4 24 4Z" 
            fill="var(--color-primary-green)"
            className="logo__leaf"
          />
          
          {/* Leaf vein */}
          <path 
            d="M24 8L24 36" 
            stroke="var(--color-accent-green)" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="logo__vein"
          />
          
          {/* Small leaves */}
          <circle 
            cx="18" 
            cy="16" 
            r="3" 
            fill="var(--color-lettuce-green)"
            className="logo__accent"
          />
          <circle 
            cx="30" 
            cy="20" 
            r="2.5" 
            fill="var(--color-lettuce-green)"
            className="logo__accent"
          />
          
          {/* Stem */}
          <rect 
            x="22" 
            y="36" 
            width="4" 
            height="8" 
            fill="var(--color-earth-brown)"
            rx="2"
            className="logo__stem"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="logo__text">
          <span className="logo__name">MyStore</span>
          <span className="logo__tagline">Fresh Farm Products</span>
        </div>
      )}
    </Link>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['default', 'light', 'dark']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showText: PropTypes.bool,
  className: PropTypes.string
};

Logo.defaultProps = {
  variant: 'default',
  size: 'medium',
  showText: true
};

export default Logo;
