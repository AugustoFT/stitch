
import React, { memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useInputMask } from '@/hooks/useInputMask';

interface PhoneFieldProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: string) => void;
  required?: boolean;
  className?: string;
}

const PhoneField = memo(({ 
  name = 'telefone',
  value = '', 
  onChange, 
  onBlur,
  required = false, 
  className = '' 
}: PhoneFieldProps) => {
  // Usar máscara diretamente no DOM sem controlar via React
  const { inputRef, getMaskedValue } = useInputMask('phone', {
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
      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
        Telefone{required && '*'}
      </label>
      <Input
        ref={inputRef}
        type="tel"
        id={name}
        name={name}
        required={required}
        defaultValue={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="stitch-input"
        placeholder="(00) 00000-0000"
        autoComplete="tel"
        spellCheck="false"
        inputMode="tel"
      />
    </div>
  );
});

PhoneField.displayName = 'PhoneField';

export default PhoneField;
