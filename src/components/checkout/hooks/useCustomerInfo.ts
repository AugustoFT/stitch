
import { useState, useEffect, useRef, useCallback } from 'react';

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
  
  // Ref to store previous form data for comparison
  const prevFormDataRef = useRef<CustomerInfoData>({...formData});

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
          // Manter o método de pagamento atual
          formaPagamento: prev.formaPagamento
        }));
      } catch (e) {
        console.error('Error parsing saved customer data', e);
      }
    }
    
    customerInfoLoaded.current = true;
  }, []);

  // Optimized change handler to prevent unnecessary updates
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof CustomerInfoData;
    
    // Only update if value actually changed
    if (formData[fieldName] !== value) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [formData]);

  const handlePaymentMethodChange = useCallback((method: string) => {
    if (formData.formaPagamento !== method) {
      setFormData(prev => ({
        ...prev,
        formaPagamento: method
      }));
    }
  }, [formData.formaPagamento]);

  // Save customer info to localStorage
  const saveCustomerInfo = useCallback(() => {
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
      
      // Update only if data changed
      const prevDataJSON = JSON.stringify(prevFormDataRef.current);
      const newDataJSON = JSON.stringify(dataToSave);
      
      if (prevDataJSON !== newDataJSON) {
        localStorage.setItem('customerInfo', newDataJSON);
        prevFormDataRef.current = {...formData};
      }
    }
  }, [formData]);

  return {
    formData,
    handleChange,
    handlePaymentMethodChange,
    saveCustomerInfo
  };
};
