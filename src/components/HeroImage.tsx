
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

interface HeroImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

// Specialized component for hero images with optimizations
const HeroImage: React.FC<HeroImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  
  // Convert PNG to WebP if from lovable-uploads
  const webpSrc = src.includes('/lovable-uploads/') && src.endsWith('.png')
    ? src.replace('.png', '.webp')
    : src;
  
  useEffect(() => {
    // Start with low quality blurred placeholder
    setCurrentSrc(`data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23e6e6e6'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`);
    
    // Preload the image
    const img = new Image();
    img.src = webpSrc;
    
    img.onload = () => {
      setCurrentSrc(webpSrc);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      // Fallback to original format if WebP fails
      if (webpSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.src = src;
        fallbackImg.onload = () => {
          setCurrentSrc(src);
          setIsLoaded(true);
        };
      }
    };
  }, [webpSrc, src, width, height]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ 
            width, 
            height,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Actual image with animation */}
      {currentSrc && (
        <motion.img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          style={{ transition: 'opacity 0.3s' }}
        />
      )}
    </div>
  );
});

HeroImage.displayName = 'HeroImage';

export default HeroImage;
