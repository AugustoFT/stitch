import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { initMercadoPago } from '../../../utils/mercadoPago';

interface ProductWithQuantity {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CheckoutFormState {
  formData: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    complemento: string;
    complemento2: string;
    cidade: string;
    estado: string;
    cep: string;
    formaPagamento: string;
    cpf: string;
  };
  isSubmitting: boolean;
  cardFormVisible: boolean;
  mercadoPagoReady: boolean;
  paymentResult: any;
  cardPaymentStatus: string | null;
  productsWithQuantity: ProductWithQuantity[];
  calculatedTotal: number;
}

export const useCheckoutForm = (selectedProducts: any[] = [], initialTotalAmount: number = 139.99) => {
  const [formState, setFormState] = useState<CheckoutFormState>({
    formData: {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      complemento: '',
      complemento2: '',
      cidade: '',
      estado: '',
      cep: '',
      formaPagamento: 'cartao',
      cpf: '',
    },
    isSubmitting: false,
    cardFormVisible: true,
    mercadoPagoReady: false,
    paymentResult: null,
    cardPaymentStatus: null,
    productsWithQuantity: [],
    calculatedTotal: initialTotalAmount,
  });
  
  // Refs for tracking initialization state
  const mercadoPagoRef = useRef<any>(null);
  const productsProcessed = useRef(false);
  const customerInfoLoaded = useRef(false);
  const scriptLoaded = useRef(false);

  // Process selectedProducts to include quantities
  useEffect(() => {
    if (productsProcessed.current || !selectedProducts || selectedProducts.length === 0) {
      return;
    }
    
    try {
      const processedProducts = selectedProducts.map(product => ({
        id: product.id,
        title: product.title,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace('R$ ', '').replace(',', '.'))
          : product.price,
        imageUrl: product.imageUrl,
        quantity: product.quantity || 1
      }));
      
      setFormState(prev => ({
        ...prev,
        productsWithQuantity: processedProducts,
        calculatedTotal: processedProducts.reduce(
          (sum, product) => sum + (product.price * product.quantity), 
          0
        )
      }));
      
      productsProcessed.current = true;
    } catch (error) {
      console.error('Error processing products:', error);
    }
  }, [selectedProducts]);

  // Load customer data from localStorage on component mount
  useEffect(() => {
    if (customerInfoLoaded.current) return;
    
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedData = JSON.parse(savedCustomerInfo);
        setFormState(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            ...parsedData,
            // Keep current payment method
            formaPagamento: prev.formData.formaPagamento
          }
        }));
      } catch (e) {
        console.error('Error parsing saved customer data', e);
      }
    }
    
    customerInfoLoaded.current = true;
  }, []);

  // Load MercadoPago SDK
  useEffect(() => {
    const loadMercadoPagoScript = () => {
      if (scriptLoaded.current) return;
      
      if (window.MercadoPago) {
        console.log('MercadoPago SDK already loaded');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setFormState(prev => ({ ...prev, mercadoPagoReady: true }));
        scriptLoaded.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        console.log('MercadoPago SDK loaded successfully');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setFormState(prev => ({ ...prev, mercadoPagoReady: true }));
        scriptLoaded.current = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
        toast.error("Falha ao carregar o processador de pagamento. Recarregue a página.");
        scriptLoaded.current = true;
      };
      
      document.body.appendChild(script);
    };

    loadMercadoPagoScript();
  }, []);

  // Handle form payment method change
  useEffect(() => {
    // Show card form only when card is selected
    setFormState(prev => ({
      ...prev,
      cardFormVisible: prev.formData.formaPagamento === 'cartao',
      paymentResult: null,
      cardPaymentStatus: null
    }));
  }, [formState.formData.formaPagamento]);

  // Save customer info to localStorage
  const saveCustomerInfo = () => {
    if (formState.formData.nome && formState.formData.email) {
      const dataToSave = {
        nome: formState.formData.nome,
        email: formState.formData.email,
        cpf: formState.formData.cpf,
        telefone: formState.formData.telefone,
        endereco: formState.formData.endereco,
        complemento: formState.formData.complemento,
        complemento2: formState.formData.complemento2,
        cidade: formState.formData.cidade,
        estado: formState.formData.estado,
        cep: formState.formData.cep
      };
      localStorage.setItem('customerInfo', JSON.stringify(dataToSave));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, formaPagamento: method }
    }));
  };

  const setIsSubmitting = (value: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting: value }));
  };

  const setPaymentResult = (value: any) => {
    setFormState(prev => ({ ...prev, paymentResult: value }));
  };

  const setCardPaymentStatus = (value: string | null) => {
    setFormState(prev => ({ ...prev, cardPaymentStatus: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomerInfo();
    // Form submission handled by payment components
  };

  return {
    formState,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    saveCustomerInfo,
    setIsSubmitting,
    setPaymentResult,
    setCardPaymentStatus
  };
};
