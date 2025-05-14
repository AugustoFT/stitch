
import React, { memo, useRef, useCallback, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { formatCPF } from '@/components/checkout/InputFormatters';

interface CPFFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const CPFField = memo(({ value, onChange, required = false, className = '' }: CPFFieldProps) => {
  // Estado local para controle de UI imediato
  const [localValue, setLocalValue] = useState(value);
  // useTransition para operações de baixa prioridade
  const [isPending, startTransition] = useTransition();
  // Ref para acessar input diretamente se necessário
  const inputRef = useRef<HTMLInputElement>(null);

  // Função debounced para formatação do CPF
  const debouncedFormat = useDebouncedCallback((input: string) => {
    startTransition(() => {
      const formattedValue = formatCPF(input);
      setLocalValue(formattedValue);
      
      // Simulamos um evento para manter compatibilidade com o formulário
      const syntheticEvent = {
        target: {
          name: 'cpf',
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
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
        CPF{required && '*'}
      </label>
      <Input
        ref={inputRef}
        type="text"
        id="cpf"
        name="cpf"
        required={required}
        value={localValue}
        onChange={handleInputChange}
        className="stitch-input"
        placeholder="000.000.000-00"
        autoComplete="off"
        spellCheck="false"
        inputMode="numeric"
        aria-busy={isPending}
      />
    </div>
  );
});

CPFField.displayName = 'CPFField';

export default CPFField;
