
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

  // Ref para rastrear o estado de inicialização
  const customerInfoLoaded = useRef(false);

  // Carregar dados do cliente do localStorage na montagem do componente
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

  // Usar versão memoizada do handleChange para evitar re-renderizações desnecessárias
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Verificar se o valor mudou para evitar atualizações desnecessárias
      if (prev[name as keyof CustomerInfoData] === value) {
        return prev;
      }
      return {
        ...prev,
        [name]: value
      };
    });
  }, []);

  const handlePaymentMethodChange = useCallback((method: string) => {
    setFormData(prev => {
      if (prev.formaPagamento === method) {
        return prev;
      }
      return {
        ...prev,
        formaPagamento: method
      };
    });
  }, []);

  // Salvar informações do cliente no localStorage
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
      localStorage.setItem('customerInfo', JSON.stringify(dataToSave));
    }
  }, [formData]);

  return {
    formData,
    handleChange,
    handlePaymentMethodChange,
    saveCustomerInfo
  };
};
