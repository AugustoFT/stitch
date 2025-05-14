
import React, { memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useInputMask } from '@/hooks/useInputMask';

interface CPFFieldProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CPFField = memo(({ 
  name = 'cpf',
  value = '', 
  onChange, 
  onBlur,
  required = false, 
  className = '' 
}: CPFFieldProps) => {
  // Usar máscara diretamente no DOM sem controlar via React
  const { inputRef, getMaskedValue } = useInputMask('cpf', {
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
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
        CPF{required && '*'}
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
        placeholder="000.000.000-00"
        autoComplete="off"
        spellCheck="false"
        inputMode="numeric"
      />
    </div>
  );
});

CPFField.displayName = 'CPFField';

export default CPFField;
