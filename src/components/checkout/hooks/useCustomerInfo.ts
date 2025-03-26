
import { useState, useEffect, useRef } from 'react';

export interface CustomerInfoData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  complemento2: string;
  cidade: string;
  estado: string;
  cep: string;
  formaPagamento: string;
  cpf: string;
}

export const useCustomerInfo = () => {
  const [formData, setFormData] = useState<CustomerInfoData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    complemento2: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    cpf: '',
  });

  // Ref for tracking initialization state
  const customerInfoLoaded = useRef(false);

  // Load customer data from localStorage on component mount
  useEffect(() => {
    if (customerInfoLoaded.current) return;
    
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedData = JSON.parse(savedCustomerInfo);
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          // Keep current payment method
          formaPagamento: prev.formaPagamento
        }));
      } catch (e) {
        console.error('Error parsing saved customer data', e);
      }
    }
    
    customerInfoLoaded.current = true;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      formaPagamento: method
    }));
  };

  // Save customer info to localStorage
  const saveCustomerInfo = () => {
    if (formData.nome && formData.email) {
      const dataToSave = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        complemento2: formData.complemento2,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep
      };
      localStorage.setItem('customerInfo', JSON.stringify(dataToSave));
    }
  };

  return {
    formData,
    handleChange,
    handlePaymentMethodChange,
    saveCustomerInfo
  };
};
