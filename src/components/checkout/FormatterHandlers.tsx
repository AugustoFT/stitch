
import React, { useCallback, useRef } from 'react';
import { formatCPF, formatPhoneNumber, formatCEP } from './InputFormatters';

interface FormatterHandlersProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormatterHandlers = ({ formData, setFormData }: FormatterHandlersProps) => {
  // Use refs to track previous values and avoid unnecessary updates
  const prevValues = useRef({
    cpf: formData.cpf || '',
    telefone: formData.telefone || '',
    cep: formData.cep || ''
  });

  // Optimized handlers with debounce for formatted fields
  const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Avoid processing if value didn't change
    if (input === prevValues.current.cpf) return;
    
    // Direct processing for empty input
    if (input === '') {
      setFormData(prev => ({ ...prev, cpf: '' }));
      prevValues.current.cpf = '';
      return;
    }
    
    const formattedValue = formatCPF(input);
    
    // Only update state if formatted value is different
    if (formattedValue !== formData.cpf) {
      setFormData(prev => ({ ...prev, cpf: formattedValue }));
      prevValues.current.cpf = formattedValue;
    }
  }, [formData.cpf, setFormData]);
  
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Avoid processing if value didn't change
    if (input === prevValues.current.telefone) return;
    
    // Direct processing for empty input
    if (input === '') {
      setFormData(prev => ({ ...prev, telefone: '' }));
      prevValues.current.telefone = '';
      return;
    }
    
    const formattedValue = formatPhoneNumber(input);
    
    // Only update state if formatted value is different
    if (formattedValue !== formData.telefone) {
      setFormData(prev => ({ ...prev, telefone: formattedValue }));
      prevValues.current.telefone = formattedValue;
    }
  }, [formData.telefone, setFormData]);
  
  const handleCEPChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Avoid processing if value didn't change
    if (input === prevValues.current.cep) return;
    
    // Direct processing for empty input
    if (input === '') {
      setFormData(prev => ({ ...prev, cep: '' }));
      prevValues.current.cep = '';
      return;
    }
    
    const formattedValue = formatCEP(input);
    
    // Only update state if formatted value is different
    if (formattedValue !== formData.cep) {
      setFormData(prev => ({ ...prev, cep: formattedValue }));
      prevValues.current.cep = formattedValue;
    }
  }, [formData.cep, setFormData]);

  // Return the handlers directly without extra memoization
  return {
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange
  };
};

export default useFormatterHandlers;
