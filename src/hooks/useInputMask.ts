
import { useRef, useEffect } from 'react';
import IMask from 'imask';

type MaskType = 'cpf' | 'phone' | 'cep' | 'card' | 'expiry' | 'cvv';

interface UseInputMaskOptions {
  onAccept?: (value: string, mask: IMask.InputMask<IMask.AnyMaskedOptions>) => void;
  onComplete?: (value: string, mask: IMask.InputMask<IMask.AnyMaskedOptions>) => void;
  lazy?: boolean;
}

// Memoize mask patterns to avoid recreating them
const maskPatterns: Record<MaskType, IMask.AnyMaskedOptions> = {
  cpf: {
    mask: '000.000.000-00',
  },
  phone: {
    mask: [
      { mask: '(00) 0000-0000', lazy: false },
      { mask: '(00) 00000-0000', lazy: false }
    ]
  },
  cep: {
    mask: '00000-000',
  },
  card: {
    mask: '0000 0000 0000 0000',
  },
  expiry: {
    mask: 'MM/YY',
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
      },
      YY: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 99,
      }
    }
  },
  cvv: {
    mask: '000',
  }
};

/**
 * Hook que aplica máscara diretamente no DOM sem re-renderizar React
 */
export function useInputMask(
  type: MaskType,
  options: UseInputMaskOptions = {}
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maskRef = useRef<IMask.InputMask<IMask.AnyMaskedOptions> | null>(null);
  const perfMarkRef = useRef<string | null>(null);
  
  // Performance metrics
  const startTypingMeasurement = () => {
    perfMarkRef.current = `input-mask-${Date.now()}`;
    performance.mark(perfMarkRef.current);
  };
  
  const endTypingMeasurement = () => {
    if (perfMarkRef.current) {
      const measureName = `${perfMarkRef.current}-duration`;
      performance.measure(measureName, perfMarkRef.current);
      const entries = performance.getEntriesByName(measureName);
      
      if (entries.length > 0) {
        const duration = entries[0].duration;
        if (duration > 10) {
          console.warn(`Input mask performance warning: ${duration.toFixed(2)}ms latency`);
        }
      }
      
      performance.clearMarks(perfMarkRef.current);
      performance.clearMeasures(measureName);
      perfMarkRef.current = null;
    }
  };
  
  // Aplicar máscara quando o ref estiver disponível
  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    
    // Cleanup anterior
    if (maskRef.current) {
      maskRef.current.destroy();
    }
    
    // Configurações da máscara
    const maskOptions = {
      ...maskPatterns[type],
      lazy: options.lazy !== undefined ? options.lazy : false
    };
    
    // Criar máscara
    const mask = IMask(inputElement, maskOptions);
    
    // Gerenciadores de eventos
    inputElement.addEventListener('keydown', startTypingMeasurement);
    inputElement.addEventListener('input', endTypingMeasurement);
    
    if (options.onAccept) {
      mask.on('accept', () => options.onAccept!(mask.value, mask));
    }
    
    if (options.onComplete) {
      mask.on('complete', () => options.onComplete!(mask.value, mask));
    }
    
    // Guardar referência
    maskRef.current = mask;
    
    return () => {
      inputElement.removeEventListener('keydown', startTypingMeasurement);
      inputElement.removeEventListener('input', endTypingMeasurement);
      mask.destroy();
    };
  }, [type, options.onAccept, options.onComplete, options.lazy]);
  
  return {
    inputRef,
    getUnmaskedValue: () => maskRef.current ? maskRef.current.unmaskedValue : '',
    getMaskedValue: () => maskRef.current ? maskRef.current.value : '',
    updateValue: (value: string) => {
      if (maskRef.current && value !== maskRef.current.value) {
        maskRef.current.value = value;
      }
    }
  };
}
