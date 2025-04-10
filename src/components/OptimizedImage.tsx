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
    
    // Check if src is empty or undefined
    if (!src) {
      console.error('Image source is empty or undefined');
      setIsError(true);
      formattedSrc = '/placeholder.svg';
    } 
    // Handle all lovable-uploads paths by ensuring they start with /public/
    else if (src.includes('lovable-uploads')) {
      // Strip any existing prefixes and ensure consistent format
      let cleanPath = src;
      
      // Remove any existing prefixes
      if (cleanPath.startsWith('/public/')) {
        cleanPath = cleanPath.substring(8); // Remove '/public/'
      } else if (cleanPath.startsWith('public/')) {
        cleanPath = cleanPath.substring(7); // Remove 'public/'
      } else if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1); // Remove leading '/'
      }
      
      // Ensure path starts with lovable-uploads/
      if (!cleanPath.startsWith('lovable-uploads/') && cleanPath.includes('lovable-uploads/')) {
        cleanPath = 'lovable-uploads/' + cleanPath.substring(cleanPath.indexOf('lovable-uploads/') + 15);
      } else if (!cleanPath.startsWith('lovable-uploads/')) {
        cleanPath = 'lovable-uploads/' + cleanPath;
      }
      
      // Apply the standard format
      formattedSrc = `/public/${cleanPath}`;
      
      // Log the transformation for debugging
      console.log(`Image path transformed: ${src} → ${formattedSrc}`);
    } 
    // Handle absolute URLs (leave unchanged)
    else if (src.startsWith('http')) {
      formattedSrc = src;
    } 
    // Handle relative paths
    else if (!src.startsWith('/')) {
      formattedSrc = `/${src}`;
    }
    
    setImageSrc(formattedSrc);
    
    // Preload image if priority is set
    if (priority) {
      const img = new Image();
      img.src = formattedSrc;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load image: ${formattedSrc}`, { originalSrc: src });
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
    console.error(`Failed to load image: ${imageSrc}`, { originalSrc: src });
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
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-gray-500 text-xs p-2 text-center">
          {alt || "Imagem não disponível"}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
