
import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
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
  
  // Normalize image path - ensure it starts with /lovable-uploads/ without /public
  const normalizedSrc = (() => {
    // Remove "/public" if it exists at the start
    let path = src.replace(/^\/public/, '');
    
    // Ensure the path starts with /lovable-uploads if it contains that segment
    if (path.includes('lovable-uploads') && !path.startsWith('/lovable-uploads')) {
      path = '/lovable-uploads/' + path.split('lovable-uploads/')[1];
    }
    
    return path;
  })();
  
  // Generate dimensions
  const dimensions = {
    width: width || undefined,
    height: height || undefined,
  };
  
  // Determine loading attribute
  const loadingAttribute = priority ? 'eager' : 'lazy';
  
  // Determine fetch priority
  const fetchPriority = priority ? 'high' : 'auto';
  
  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = normalizedSrc;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setIsError(true);
    }
    
    // Log path information for debugging
    console.log('Image path info:', {
      original: src,
      normalized: normalizedSrc,
      contains: src.includes('lovable-uploads'),
      priority: priority
    });
  }, [normalizedSrc, priority, src]);
  
  const onImageLoad = () => {
    setIsLoaded(true);
  };
  
  const onImageError = () => {
    console.error('Failed to load image:', { originalSrc: normalizedSrc });
    setIsError(true);
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
  
  // Render fallback image if original image fails to load
  if (isError) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
          <div className="text-gray-400 text-center p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-xs">{alt}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {renderPlaceholder()}
      <img
        src={normalizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.2s' }}
        onLoad={onImageLoad}
        onError={onImageError}
        loading={loadingAttribute}
        fetchPriority={fetchPriority as "high" | "low" | "auto" | undefined}
        {...dimensions}
      />
    </div>
  );
};

export default OptimizedImage;
