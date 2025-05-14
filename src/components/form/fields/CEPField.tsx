
import React, { memo, useRef, useCallback, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { formatCEP } from '@/components/checkout/InputFormatters';

interface CEPFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const CEPField = memo(({ value, onChange, required = false, className = '' }: CEPFieldProps) => {
  // Estado local para controle de UI imediato
  const [localValue, setLocalValue] = useState(value);
  // useTransition para operações de baixa prioridade
  const [isPending, startTransition] = useTransition();
  // Ref para acessar input diretamente se necessário
  const inputRef = useRef<HTMLInputElement>(null);

  // Função debounced para formatação do CEP
  const debouncedFormat = useDebouncedCallback((input: string) => {
    startTransition(() => {
      const formattedValue = formatCEP(input);
      setLocalValue(formattedValue);
      
      // Simulamos um evento para manter compatibilidade com o formulário
      const syntheticEvent = {
        target: {
          name: 'cep',
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    });
  }, 200);

  // Handler para mudança imediata no input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Atualize o valor local imediatamente para feedback instantâneo
    setLocalValue(input);
    
    // Use debounce para a formatação e atualização do estado global
    debouncedFormat(input);
  }, [debouncedFormat]);

  return (
    <div className={`field-container ${className}`} style={{ contain: 'content' }}>
      <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
        CEP{required && '*'}
      </label>
      <Input
        ref={inputRef}
        type="text"
        id="cep"
        name="cep"
        required={required}
        value={localValue}
        onChange={handleInputChange}
        className="stitch-input"
        placeholder="00000-000"
        autoComplete="postal-code"
        spellCheck="false"
        inputMode="numeric"
        aria-busy={isPending}
      />
    </div>
  );
});

CEPField.displayName = 'CEPField';

export default CEPField;
