
import React, { useCallback } from 'react';
import { formatCPF, formatPhoneNumber, formatCEP } from './InputFormatters';

interface FormatterHandlersProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormatterHandlers = ({ formData, setFormData }: FormatterHandlersProps) => {
  // Optimized handlers for formatted fields
  const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only format if the value changed
    if (input !== formData.cpf) {
      const formattedValue = formatCPF(input);
      setFormData(prev => {
        // Avoid unnecessary state updates
        if (prev.cpf === formattedValue) return prev;
        return { ...prev, cpf: formattedValue };
      });
    }
  }, [formData.cpf, setFormData]);
  
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only format if the value changed
    if (input !== formData.telefone) {
      const formattedValue = formatPhoneNumber(input);
      setFormData(prev => {
        // Avoid unnecessary state updates
        if (prev.telefone === formattedValue) return prev;
        return { ...prev, telefone: formattedValue };
      });
    }
  }, [formData.telefone, setFormData]);
  
  const handleCEPChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only format if the value changed
    if (input !== formData.cep) {
      const formattedValue = formatCEP(input);
      setFormData(prev => {
        // Avoid unnecessary state updates
        if (prev.cep === formattedValue) return prev;
        return { ...prev, cep: formattedValue };
      });
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
