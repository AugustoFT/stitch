
import React from 'react';
import { formatCPF, formatPhoneNumber, formatCEP } from './InputFormatters';

interface FormatterHandlersProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormatterHandlers = ({ formData, handleChange, setFormData }: FormatterHandlersProps) => {
  // Handle formatted input changes
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formattedValue }));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formattedValue }));
  };
  
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: formattedValue }));
  };

  return {
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange
  };
};

export default useFormatterHandlers;
