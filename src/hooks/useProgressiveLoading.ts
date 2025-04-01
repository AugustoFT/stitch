
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
    
    // Em mobile, carrega após um pequeno delay para priorizar conteúdo crítico
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isMobile, delay]);
  
  return shouldLoad;
}
