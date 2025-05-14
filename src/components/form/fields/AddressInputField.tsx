
import React, { memo, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface AddressInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const AddressInputField = memo(({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  className = '' 
}: AddressInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className={`field-container ${className}`} style={{ contain: 'content' }}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <Input
        ref={inputRef}
        type="text"
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={handleInputChange}
        className="stitch-input"
        placeholder={placeholder}
        autoComplete={id === "endereco" ? "street-address" : id === "cidade" ? "address-level2" : "off"}
        spellCheck="false"
      />
    </div>
  );
});

AddressInputField.displayName = 'AddressInputField';

export default AddressInputField;
