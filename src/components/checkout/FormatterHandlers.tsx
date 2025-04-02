
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
  
  // Debounce timer refs
  const debounceTimers = useRef({
    cpf: 0,
    telefone: 0,
    cep: 0
  });

  // Optimized formatter with debounce for CPF
  const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Direct update for empty input for better UX
    if (input === '') {
      setFormData(prev => ({ ...prev, cpf: '' }));
      prevValues.current.cpf = '';
      return;
    }
    
    // Immediate visual feedback for better UX
    const simpleDigits = input.replace(/\D/g, '').slice(0, 11);
    if (simpleDigits !== input.replace(/\D/g, '')) {
      setFormData(prev => ({ ...prev, cpf: simpleDigits }));
    }
    
    // Clear previous timer
    if (debounceTimers.current.cpf) {
      clearTimeout(debounceTimers.current.cpf);
    }
    
    // Debounce the formatting for better performance
    debounceTimers.current.cpf = window.setTimeout(() => {
      const formattedValue = formatCPF(input);
      
      // Only update state if formatted value is different
      if (formattedValue !== prevValues.current.cpf) {
        setFormData(prev => ({ ...prev, cpf: formattedValue }));
        prevValues.current.cpf = formattedValue;
      }
    }, 100); // Short delay for better UX
  }, [setFormData]);
  
  // Optimized formatter with debounce for phone
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Direct update for empty input for better UX
    if (input === '') {
      setFormData(prev => ({ ...prev, telefone: '' }));
      prevValues.current.telefone = '';
      return;
    }
    
    // Immediate visual feedback for better UX
    const simpleDigits = input.replace(/\D/g, '').slice(0, 11);
    if (simpleDigits !== input.replace(/\D/g, '')) {
      setFormData(prev => ({ ...prev, telefone: simpleDigits }));
    }
    
    // Clear previous timer
    if (debounceTimers.current.telefone) {
      clearTimeout(debounceTimers.current.telefone);
    }
    
    // Debounce the formatting for better performance
    debounceTimers.current.telefone = window.setTimeout(() => {
      const formattedValue = formatPhoneNumber(input);
      
      // Only update state if formatted value is different
      if (formattedValue !== prevValues.current.telefone) {
        setFormData(prev => ({ ...prev, telefone: formattedValue }));
        prevValues.current.telefone = formattedValue;
      }
    }, 100); // Short delay for better UX
  }, [setFormData]);
  
  // Optimized formatter with debounce for CEP
  const handleCEPChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Direct update for empty input for better UX
    if (input === '') {
      setFormData(prev => ({ ...prev, cep: '' }));
      prevValues.current.cep = '';
      return;
    }
    
    // Immediate visual feedback for better UX
    const simpleDigits = input.replace(/\D/g, '').slice(0, 8);
    if (simpleDigits !== input.replace(/\D/g, '')) {
      setFormData(prev => ({ ...prev, cep: simpleDigits }));
    }
    
    // Clear previous timer
    if (debounceTimers.current.cep) {
      clearTimeout(debounceTimers.current.cep);
    }
    
    // Debounce the formatting for better performance
    debounceTimers.current.cep = window.setTimeout(() => {
      const formattedValue = formatCEP(input);
      
      // Only update state if formatted value is different
      if (formattedValue !== prevValues.current.cep) {
        setFormData(prev => ({ ...prev, cep: formattedValue }));
        prevValues.current.cep = formattedValue;
      }
    }, 100); // Short delay for better UX
  }, [setFormData]);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    Object.values(debounceTimers.current).forEach(timerId => {
      if (timerId) {
        clearTimeout(timerId);
      }
    });
  }, []);

  // Return the handlers and cleanup function
  return {
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange,
    cleanup
  };
};

export default useFormatterHandlers;
