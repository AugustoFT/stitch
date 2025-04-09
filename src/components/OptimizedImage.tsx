
import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  objectFit = 'contain'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  
  // Generate dimensions
  const dimensions = {
    width: width || undefined,
    height: height || undefined,
  };
  
  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setImageSrc(src);
  }, [src]);
  
  // Determine loading attribute
  const loadingAttribute = priority ? 'eager' : 'lazy';
  
  // Determine fetch priority
  const fetchPriority = priority ? 'high' : 'auto';
  
  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        setIsError(true);
      };
    }
  }, [src, priority]);
  
  const onImageLoad = () => {
    setIsLoaded(true);
  };
  
  const onImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsError(true);
    // Use a fallback image - make sure placeholder.svg exists in public directory
    setImageSrc('/placeholder.svg');
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

  // Use a direct src attribute to avoid any potential issues with image loading
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {renderPlaceholder()}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={{ objectFit }}
        onLoad={onImageLoad}
        onError={onImageError}
        loading={loadingAttribute}
        fetchPriority={fetchPriority as any}
        {...dimensions}
      />
      {isError && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-xs p-2 text-center">
          {alt || "Imagem não disponível"}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
