
import { useState } from 'react';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  [key: string]: string;
}

export const usePixFormValidation = (formData: FormData) => {
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Validate customer information before generating PIX
  const validateCustomerInfo = () => {
    const errors = [];
    
    if (!formData.nome || formData.nome.length < 3) {
      errors.push('Nome completo é obrigatório');
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      errors.push('Email válido é obrigatório');
    }
    
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      errors.push('CPF válido é obrigatório');
    }
    
    if (!formData.endereco) {
      errors.push('Endereço é obrigatório');
    }
    
    if (!formData.cidade) {
      errors.push('Cidade é obrigatória');
    }
    
    if (!formData.estado) {
      errors.push('Estado é obrigatório');
    }
    
    if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
      errors.push('CEP válido é obrigatório');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const getProductDescription = (selectedProducts: any[] = []) => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return 'Pelúcia Stitch';
    }
    
    if (selectedProducts.length === 1) {
      return selectedProducts[0].title;
    }
    
    return `Compra Stitch (${selectedProducts.length} itens)`;
  };

  return {
    formErrors,
    setFormErrors,
    validateCustomerInfo,
    getProductDescription
  };
};

export default usePixFormValidation;
