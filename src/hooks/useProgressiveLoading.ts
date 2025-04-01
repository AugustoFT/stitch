
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
    
    let timeoutId: number | NodeJS.Timeout;
    
    // Em dispositivos móveis com conexões mais lentas
    if (typeof window !== 'undefined') {
      // Verificar suporte para requestIdleCallback
      if ('requestIdleCallback' in window) {
        try {
          timeoutId = window.requestIdleCallback(
            () => {
              setShouldLoad(true);
            },
            { timeout: delay }
          );
          
          return () => {
            if ('cancelIdleCallback' in window) {
              window.cancelIdleCallback(timeoutId as number);
            }
          };
        } catch (error) {
          console.warn('Error using requestIdleCallback, falling back to setTimeout:', error);
          // Se requestIdleCallback falhar, usa setTimeout como fallback
          timeoutId = setTimeout(() => {
            setShouldLoad(true);
          }, delay);
          
          return () => clearTimeout(timeoutId as NodeJS.Timeout);
        }
      } else {
        // Fallback para setTimeout em navegadores que não suportam requestIdleCallback
        timeoutId = setTimeout(() => {
          setShouldLoad(true);
        }, delay);
        
        return () => clearTimeout(timeoutId as NodeJS.Timeout);
      }
    } else {
      // Caso window não esteja disponível (SSR)
      setShouldLoad(true);
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
