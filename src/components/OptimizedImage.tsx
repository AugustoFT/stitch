
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
  const [imageSrc, setImageSrc] = useState('');
  
  // Generate dimensions
  const dimensions = {
    width: width || undefined,
    height: height || undefined,
  };
  
  // Reset states when src changes and set the correct image path
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    
    // Normalize image path based on different formats
    let formattedSrc = src;
    
    if (src.includes('lovable-uploads')) {
      // Handle paths with or without /public/ prefix
      if (src.startsWith('/public/')) {
        formattedSrc = src;
      } else if (src.startsWith('public/')) {
        formattedSrc = `/${src}`;
      } else if (src.startsWith('lovable-uploads/')) {
        formattedSrc = `/public/lovable-uploads/${src.replace('lovable-uploads/', '')}`;
      } else if (!src.startsWith('/')) {
        formattedSrc = `/public/${src}`;
      }
    } else if (src.startsWith('http')) {
      // Leave absolute URLs unchanged
      formattedSrc = src;
    } else if (!src.startsWith('/')) {
      // Add leading slash for relative paths
      formattedSrc = `/${src}`;
    }
    
    setImageSrc(formattedSrc);
    
    // Preload image if priority is set
    if (priority) {
      const img = new Image();
      img.src = formattedSrc;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load image: ${formattedSrc}`);
        setIsError(true);
        // Use a fallback image
        setImageSrc('/placeholder.svg');
      };
    }
  }, [src, priority]);
  
  // Determine loading attribute
  const loadingAttribute = priority ? 'eager' : 'lazy';
  
  // Determine fetch priority
  const fetchPriority = priority ? 'high' : 'auto';
  
  const onImageLoad = () => {
    setIsLoaded(true);
  };
  
  const onImageError = () => {
    console.error(`Failed to load image: ${imageSrc}, original src: ${src}`);
    setIsError(true);
    // Use a fallback image
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
        className={`${className} ${isError ? 'opacity-30' : ''}`}
        style={{ objectFit }}
        onLoad={onImageLoad}
        onError={onImageError}
        loading={loadingAttribute}
        fetchPriority={fetchPriority as any}
        {...dimensions}
      />
      {isError && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-gray-500 text-xs p-2 text-center">
          {alt || "Imagem não disponível"}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
