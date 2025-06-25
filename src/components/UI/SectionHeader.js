import React from 'react';
import PropTypes from 'prop-types';
import './SectionHeader.css';

const SectionHeader = ({ 
  title, 
  subtitle, 
  description,
  alignment = 'center',
  size = 'medium',
  className = '',
  titleTag = 'h2',
  subtitleTag = 'span',
  showDivider = false,
  dividerColor = 'accent',
  ...props 
}) => {
  const headerClasses = [
    'section-header',
    `section-header--${alignment}`,
    `section-header--${size}`,
    showDivider ? `section-header--divider-${dividerColor}` : '',
    className
  ].filter(Boolean).join(' ');

  // Dynamic title tag
  const TitleTag = titleTag;
  const SubtitleTag = subtitleTag;

  return (
    <div className={headerClasses} {...props}>
      {subtitle && (
        <SubtitleTag className="section-header__subtitle">
          {subtitle}
        </SubtitleTag>
      )}
      
      {title && (
        <TitleTag className="section-header__title">
          {title}
        </TitleTag>
      )}
      
      {showDivider && (
        <div className="section-header__divider" aria-hidden="true"></div>
      )}
      
      {description && (
        <p className="section-header__description">
          {description}
        </p>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  titleTag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  subtitleTag: PropTypes.oneOf(['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  showDivider: PropTypes.bool,
  dividerColor: PropTypes.oneOf(['primary', 'accent', 'earth'])
};

SectionHeader.defaultProps = {
  alignment: 'center',
  size: 'medium',
  titleTag: 'h2',
  subtitleTag: 'span',
  showDivider: false,
  dividerColor: 'accent'
};

export default SectionHeader;
