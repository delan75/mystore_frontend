import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import './Button.css';

const Button = ({ 
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  href = null,
  to = null,
  external = false,
  className = '',
  onClick,
  ...props 
}) => {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    loading ? 'btn--loading' : '',
    disabled ? 'btn--disabled' : '',
    icon ? `btn--with-icon btn--icon-${iconPosition}` : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const ButtonContent = () => (
    <>
      {loading && (
        <LoadingSpinner 
          size="small" 
          color={variant === 'primary' || variant === 'accent' ? 'white' : 'primary'}
          className="btn__spinner"
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn__icon btn__icon--left" aria-hidden="true">
          {typeof icon === 'string' ? <i className={icon}></i> : icon}
        </span>
      )}
      
      <span className="btn__text">
        {children}
      </span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {typeof icon === 'string' ? <i className={icon}></i> : icon}
        </span>
      )}
    </>
  );

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || loading}
        {...props}
      >
        <ButtonContent />
      </a>
    );
  }

  // React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        {...props}
      >
        <ButtonContent />
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      <ButtonContent />
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 
    'secondary', 
    'accent', 
    'outline', 
    'ghost', 
    'danger',
    'success',
    'earth'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  href: PropTypes.string,
  to: PropTypes.string,
  external: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconPosition: 'left',
  external: false
};

export default Button;
