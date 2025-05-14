
import React, { memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useInputMask } from '@/hooks/useInputMask';

interface CEPFieldProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CEPField = memo(({ 
  name = 'cep',
  value = '', 
  onChange, 
  onBlur,
  required = false, 
  className = '' 
}: CEPFieldProps) => {
  // Usar máscara diretamente no DOM sem controlar via React
  const { inputRef, getMaskedValue } = useInputMask('cep', {
    onComplete: (value) => {
      if (onBlur) onBlur(value);
    }
  });
  
  // Usar em conjunto com React para manter compatibilidade
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);
  
  const handleBlur = useCallback(() => {
    if (onBlur && inputRef.current) {
      onBlur(getMaskedValue());
    }
  }, [onBlur, getMaskedValue]);
  
  return (
    <div className={`field-container ${className}`} style={{ contain: 'content' }}>
      <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
        CEP{required && '*'}
      </label>
      <Input
        ref={inputRef}
        type="text"
        id={name}
        name={name}
        required={required}
        defaultValue={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="stitch-input"
        placeholder="00000-000"
        autoComplete="postal-code"
        spellCheck="false"
        inputMode="numeric"
      />
    </div>
  );
});

CEPField.displayName = 'CEPField';

export default CEPField;
