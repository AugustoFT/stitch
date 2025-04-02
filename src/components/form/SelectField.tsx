
import React, { memo, useCallback } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  className?: string;
}

const SelectField = memo(({ 
  id, 
  label, 
  required = false, 
  value, 
  onChange, 
  options,
  className = ""
}: SelectFieldProps) => {
  // Prevent unnecessary re-renders with useCallback
  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        value={value || ''}
        onChange={handleSelectChange}
        className="stitch-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
