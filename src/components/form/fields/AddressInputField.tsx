
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
  const perfMarkRef = useRef<string | null>(null);
  
  // Performance metrics
  const startTypingMeasurement = useCallback(() => {
    perfMarkRef.current = `input-${id}-${Date.now()}`;
    performance.mark(perfMarkRef.current);
  }, [id]);
  
  const endTypingMeasurement = useCallback(() => {
    if (perfMarkRef.current) {
      const measureName = `${perfMarkRef.current}-duration`;
      performance.measure(measureName, perfMarkRef.current);
      const entries = performance.getEntriesByName(measureName);
      
      if (entries.length > 0) {
        const duration = entries[0].duration;
        if (duration > 10) {
          console.warn(`Input ${id} performance warning: ${duration.toFixed(2)}ms latency`);
        }
      }
      
      performance.clearMarks(perfMarkRef.current);
      performance.clearMeasures(measureName);
      perfMarkRef.current = null;
    }
  }, [id]);

  // Use uncontrolled input for better performance
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Start measurement on input
    requestAnimationFrame(() => {
      endTypingMeasurement();
      onChange(e);
    });
  }, [onChange, endTypingMeasurement]);

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
        defaultValue={value}
        onChange={handleInputChange}
        onKeyDown={startTypingMeasurement}
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
