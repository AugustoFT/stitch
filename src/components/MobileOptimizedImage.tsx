
import React, { useState, useEffect, memo } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { convertToWebP, getResponsiveImageDimensions } from '../utils/imageOptimizer';

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  mobileSizes?: {
    width: number;
    height: number;
  };
}

const MobileOptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  mobileSizes
}: MobileOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Determinar dimensões apropriadas baseado no dispositivo
  const dimensions = isMobile && mobileSizes 
    ? mobileSizes 
    : { width, height };
  
  // Converter para WebP se possível
  const optimizedSrc = convertToWebP(src);
  
  // Precarregar imagens prioritárias
  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => setIsLoaded(true);
    }
  }, [optimizedSrc, priority]);
  
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !priority && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
            aspectRatio: dimensions.width && dimensions.height 
              ? `${dimensions.width} / ${dimensions.height}` 
              : 'auto'
          }}
        ></div>
      )}
      
      <picture>
        {/* Fonte WebP para navegadores compatíveis */}
        <source 
          srcSet={optimizedSrc} 
          type="image/webp"
          media={isMobile ? "(max-width: 768px)" : ""}
        />
        
        {/* Imagem original como fallback */}
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.3s' }}
          width={dimensions.width}
          height={dimensions.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
        />
      </picture>
    </div>
  );
});

MobileOptimizedImage.displayName = 'MobileOptimizedImage';

export default MobileOptimizedImage;
