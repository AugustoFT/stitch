
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook para carregamento progressivo de conteúdo em dispositivos móveis
 * Ajuda a priorizar a renderização de componentes importantes primeiro
 */
export function useProgressiveLoading(delay: number = 100) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Em desktops, carrega imediatamente
    if (!isMobile) {
      setShouldLoad(true);
      return;
    }
    
    // Em dispositivos móveis com conexões mais lentas, usar requestIdleCallback
    // para carregar durante períodos ociosos do navegador
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const timeoutId = window.requestIdleCallback(
        () => {
          setShouldLoad(true);
        },
        { timeout: delay }
      );
      
      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(timeoutId);
        }
      };
    } else {
      // Fallback para setTimeout em navegadores que não suportam requestIdleCallback
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, delay]);
  
  return shouldLoad;
}

// Adicionar tipos para TypeScript
declare global {
  interface Window {
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}
