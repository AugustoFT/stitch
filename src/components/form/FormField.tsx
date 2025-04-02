
import React, { memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  className?: string;
}

const FormField = memo(({ 
  id, 
  label, 
  required = false, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  className = ""
}: FormFieldProps) => {
  // Prevent unnecessary re-renders with useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <Input
        type={type}
        id={id}
        name={id}
        required={required}
        value={value || ''}
        onChange={handleInputChange}
        className="stitch-input"
        placeholder={placeholder}
        // Improve performance by using these attributes
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
