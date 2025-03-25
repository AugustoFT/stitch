
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCart } from './useCart';
import { useCustomerInfo } from './useCustomerInfo';
import { useMercadoPago } from './useMercadoPago';
import { usePaymentState } from './usePaymentState';

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
  productsWithQuantity: any[];
  calculatedTotal: number;
}

export const useCheckoutForm = (initialProducts: any[] = [], initialTotalAmount: number = 139.99) => {
  // Use the smaller, more focused hooks
  const { 
    productsWithQuantity, 
    calculatedTotal, 
    updateProductQuantity, 
    removeProduct 
  } = useCart(initialProducts, initialTotalAmount);
  
  const { 
    formData, 
    handleChange, 
    handlePaymentMethodChange, 
    saveCustomerInfo 
  } = useCustomerInfo();
  
  const { 
    mercadoPagoReady 
  } = useMercadoPago();
  
  const { 
    isSubmitting, 
    cardFormVisible, 
    paymentResult, 
    cardPaymentStatus,
    setIsSubmitting, 
    setPaymentResult, 
    setCardPaymentStatus 
  } = usePaymentState(formData.formaPagamento);

  // Combine all the individual states into a single formState for backwards compatibility
  const [formState, setFormState] = useState<CheckoutFormState>({
    formData,
    isSubmitting,
    cardFormVisible,
    mercadoPagoReady,
    paymentResult,
    cardPaymentStatus,
    productsWithQuantity,
    calculatedTotal
  });

  // Update formState whenever any of the constituent states change
  useEffect(() => {
    setFormState({
      formData,
      isSubmitting,
      cardFormVisible,
      mercadoPagoReady,
      paymentResult,
      cardPaymentStatus,
      productsWithQuantity,
      calculatedTotal
    });
  }, [
    formData, 
    isSubmitting,
    cardFormVisible,
    mercadoPagoReady,
    paymentResult,
    cardPaymentStatus,
    productsWithQuantity,
    calculatedTotal
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomerInfo();
    // Form submission handled by payment components
  };

  // Handle product removal with toast notification
  const handleRemoveProduct = (productId: number) => {
    removeProduct(productId);
    toast.info("Produto removido do carrinho");
  };

  return {
    formState,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    saveCustomerInfo,
    setIsSubmitting,
    setPaymentResult,
    setCardPaymentStatus,
    updateProductQuantity,
    removeProduct: handleRemoveProduct
  };
};
