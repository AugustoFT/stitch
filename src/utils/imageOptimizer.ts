
/**
 * Utility functions for image optimization
 */

// Convert an image URL to WebP format
export const convertToWebP = (url: string): string => {
  if (url.includes('/lovable-uploads/') && url.endsWith('.png')) {
    return url.replace('.png', '.webp');
  }
  return url;
};

// Get appropriate image dimensions based on viewport
export const getResponsiveImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 800
): { width: number; height: number } => {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = originalHeight / originalWidth;
  const newWidth = maxWidth;
  const newHeight = Math.round(newWidth * ratio);
  
  return { width: newWidth, height: newHeight };
};

// Generate a blurred placeholder for an image
export const generateBlurPlaceholder = (width: number, height: number): string => {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23f2f7ff'/%3E%3C/svg%3E`;
};

// Determine if an image should be lazy loaded based on importance
export const shouldLazyLoad = (
  importance: 'high' | 'medium' | 'low' = 'medium',
  isVisible: boolean = false
): boolean => {
  if (importance === 'high') return false;
  if (isVisible) return false;
  return true;
};

// Calculate an appropriate quality setting based on image size
export const calculateQualityBySize = (fileSize: number): number => {
  if (fileSize > 1000000) return 60; // Large images > 1MB
  if (fileSize > 500000) return 70;  // Medium images > 500KB
  if (fileSize > 100000) return 80;  // Small images > 100KB
  return 85; // Tiny images
};

// Get image format support detection
export const supportsWebP = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  return false;
};

// Optimize image loading sequence
export const optimizeLoadingSequence = (images: string[]): string[] => {
  // First identify critical above-the-fold images
  const criticalImages = images.filter(img => 
    img.includes('hero') || 
    img.includes('logo') || 
    img.includes('header')
  );
  
  // Then sort remaining images by estimated importance
  const remainingImages = images
    .filter(img => !criticalImages.includes(img))
    .sort((a, b) => {
      // Prioritize smaller images that likely load faster
      const aSize = a.length;
      const bSize = b.length;
      return aSize - bSize;
    });
  
  return [...criticalImages, ...remainingImages];
};

export default {
  convertToWebP,
  getResponsiveImageDimensions,
  generateBlurPlaceholder,
  shouldLazyLoad,
  calculateQualityBySize,
  supportsWebP,
  optimizeLoadingSequence
};
