
import React, { useState, useEffect, memo, useRef } from 'react';
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
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Determinar dimensões apropriadas baseado no dispositivo
  const dimensions = isMobile && mobileSizes 
    ? mobileSizes 
    : { width, height };
  
  // Converter para WebP se possível
  const optimizedSrc = convertToWebP(src);
  
  // Usar Intersection Observer para carregar imagens apenas quando estiverem próximas de entrar na viewport
  useEffect(() => {
    // Sempre carregar imagens prioritárias imediatamente
    if (priority) {
      setIsInView(true);
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => setIsLoaded(true);
      return;
    }
    
    const currentRef = imageRef.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Começar a carregar quando estiver a 200px da viewport
        threshold: 0.01
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [optimizedSrc, priority]);
  
  return (
    <div 
      ref={imageRef}
      className={`relative ${className}`}
      style={{
        width: dimensions.width, 
        height: dimensions.height
      }}
    >
      {!isLoaded && (
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
      
      {(isInView || priority) && (
        <picture>
          {/* Fonte WebP para navegadores compatíveis */}
          <source 
            srcSet={optimizedSrc} 
            type="image/webp"
            media={isMobile ? "(max-width: 768px)" : ""}
          />
          
          {/* Adicionar srcSet para responsividade */}
          {!isMobile && dimensions.width && (
            <source
              srcSet={`${src} 1x, ${src} 2x`}
              media="(min-width: 769px)"
            />
          )}
          
          {/* Imagem original como fallback */}
          <img
            src={src}
            alt={alt}
            className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            width={dimensions.width}
            height={dimensions.height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            onLoad={() => setIsLoaded(true)}
          />
        </picture>
      )}
    </div>
  );
});

MobileOptimizedImage.displayName = 'MobileOptimizedImage';

export default MobileOptimizedImage;
