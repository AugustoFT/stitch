
import React, { useState, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Convert PNG to WebP if from lovable-uploads
  const optimizedSrc = src.includes('/lovable-uploads/') && src.endsWith('.png') 
    ? src.replace('.png', '.webp') 
    : src;
  
  // Generate dimensions
  const dimensions = {
    width: width || undefined,
    height: height || undefined,
  };
  
  // Determine loading attribute based on priority
  const loadingAttribute = priority ? 'eager' : 'lazy';
  
  // Determine fetch priority
  const fetchPriority = priority ? 'high' : 'auto';
  
  // Preload high priority images
  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        setIsError(true);
        // Fallback to original format if WebP fails
        if (optimizedSrc !== src) {
          const fallbackImg = new Image();
          fallbackImg.src = src;
          fallbackImg.onload = () => setIsLoaded(true);
        }
      };
    }
  }, [optimizedSrc, priority, src]);
  
  const onImageLoad = () => {
    setIsLoaded(true);
  };
  
  const onImageError = () => {
    setIsError(true);
    // If WebP format fails, try original
    if (optimizedSrc !== src && !isLoaded) {
      const imgElement = document.createElement('img');
      imgElement.src = src;
      imgElement.onload = onImageLoad;
    }
  };
  
  // Generate a placeholder for the image
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && !isLoaded) {
      return (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ transition: 'opacity 0.2s' }}
        />
      );
    }
    return null;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {renderPlaceholder()}
      <picture>
        {optimizedSrc !== src && (
          <source srcSet={optimizedSrc} type="image/webp" />
        )}
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={onImageLoad}
          onError={onImageError}
          loading={loadingAttribute}
          fetchPriority={fetchPriority}
          width={dimensions.width}
          height={dimensions.height}
          decoding={priority ? "sync" : "async"}
        />
      </picture>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
