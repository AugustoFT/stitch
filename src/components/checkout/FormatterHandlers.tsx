
import React, { useCallback, useMemo } from 'react';
import { formatCPF, formatPhoneNumber, formatCEP } from './InputFormatters';

interface FormatterHandlersProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormatterHandlers = ({ formData, handleChange, setFormData }: FormatterHandlersProps) => {
  // Memorize os manipuladores de eventos para evitar recreações em cada renderização
  const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    if (formData.cpf !== formattedValue) {
      setFormData(prev => ({ ...prev, cpf: formattedValue }));
    }
  }, [formData.cpf, setFormData]);
  
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    if (formData.telefone !== formattedValue) {
      setFormData(prev => ({ ...prev, telefone: formattedValue }));
    }
  }, [formData.telefone, setFormData]);
  
  const handleCEPChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    if (formData.cep !== formattedValue) {
      setFormData(prev => ({ ...prev, cep: formattedValue }));
    }
  }, [formData.cep, setFormData]);

  // Retornar funções memoizadas
  return useMemo(() => ({
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange
  }), [handleCPFChange, handlePhoneChange, handleCEPChange]);
};

export default useFormatterHandlers;
