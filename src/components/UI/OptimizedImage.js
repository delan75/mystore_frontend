import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './OptimizedImage.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder = true,
  onLoad,
  onError,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager' || priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && !priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before the image enters viewport
          threshold: 0.1
        }
      );

      observerRef.current.observe(imgRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [loading, priority]);

  // Generate responsive image URLs
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || imageError) return '';
    
    try {
      const url = new URL(baseSrc, window.location.origin);
      const pathParts = url.pathname.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      return [
        `${basePath}_400w.${extension} 400w`,
        `${basePath}_800w.${extension} 800w`,
        `${basePath}_1200w.${extension} 1200w`
      ].join(', ');
    } catch (error) {
      // If URL parsing fails, return original src
      return `${baseSrc} ${width}w`;
    }
  };

  // Generate WebP source URLs
  const generateWebPSrcSet = (baseSrc) => {
    if (!baseSrc || imageError) return '';
    
    try {
      const url = new URL(baseSrc, window.location.origin);
      const pathParts = url.pathname.split('.');
      pathParts.pop(); // Remove original extension
      const basePath = pathParts.join('.');
      
      return [
        `${basePath}_400w.webp 400w`,
        `${basePath}_800w.webp 800w`,
        `${basePath}_1200w.webp 1200w`
      ].join(', ');
    } catch (error) {
      // If URL parsing fails, try simple WebP conversion
      return baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
  };

  const handleImageLoad = (event) => {
    setImageLoaded(true);
    onLoad?.(event);
  };

  const handleImageError = (event) => {
    setImageError(true);
    onError?.(event);
  };

  // Don't render anything if not in view and lazy loading
  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`optimized-image optimized-image--placeholder ${className}`}
        style={{ 
          width: width ? `${width}px` : '100%', 
          height: height ? `${height}px` : 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          backgroundColor: 'var(--color-light-gray)'
        }}
        aria-label={alt}
      >
        {placeholder && (
          <div className="optimized-image__placeholder-content">
            <i className="fas fa-image" style={{ color: 'var(--color-medium-gray)' }}></i>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (imageError || !src) {
    return (
      <div 
        className={`optimized-image optimized-image--error ${className}`}
        style={{ 
          width: width ? `${width}px` : '100%', 
          height: height ? `${height}px` : 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <div className="optimized-image__error-content">
          <i className="fas fa-exclamation-triangle" style={{ color: 'var(--color-medium-gray)' }}></i>
          <span className="body-sm">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`optimized-image ${className}`} ref={imgRef}>
      {/* Loading skeleton */}
      {!imageLoaded && placeholder && (
        <div 
          className="optimized-image__skeleton"
          style={{ 
            width: width ? `${width}px` : '100%', 
            height: height ? `${height}px` : 'auto',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        >
          <div className="optimized-image__skeleton-shimmer"></div>
        </div>
      )}
      
      {/* Actual image */}
      <picture>
        {/* WebP source for modern browsers */}
        <source 
          srcSet={generateWebPSrcSet(src)}
          type="image/webp"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Fallback for browsers that don't support WebP */}
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : undefined,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity var(--transition-normal)'
          }}
          {...props}
        />
      </picture>
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  priority: PropTypes.bool,
  placeholder: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

OptimizedImage.defaultProps = {
  loading: 'lazy',
  priority: false,
  placeholder: true
};

export default OptimizedImage;
