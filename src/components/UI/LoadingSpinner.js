import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  className = '',
  text = '',
  overlay = false,
  ...props 
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    overlay ? 'loading-spinner--overlay' : '',
    className
  ].filter(Boolean).join(' ');

  const SpinnerContent = () => (
    <div className={spinnerClasses} {...props}>
      <div className="loading-spinner__circle">
        <div className="loading-spinner__inner"></div>
      </div>
      {text && (
        <div className="loading-spinner__text">
          {text}
        </div>
      )}
    </div>
  );

  // If overlay is true, wrap in overlay container
  if (overlay) {
    return (
      <div className="loading-spinner-overlay">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['primary', 'accent', 'white', 'dark']),
  className: PropTypes.string,
  text: PropTypes.string,
  overlay: PropTypes.bool
};

LoadingSpinner.defaultProps = {
  size: 'medium',
  color: 'primary',
  overlay: false
};

export default LoadingSpinner;
