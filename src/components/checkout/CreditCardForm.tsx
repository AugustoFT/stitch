
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import CardSuccessState from './card/CardSuccessState';
import CardPaymentWrapper from './card/CardPaymentWrapper';
import { useCardFormValidation } from './hooks/useCardFormValidation';
import { useCardPayment } from './hooks/useCardPayment';
import { pushToDataLayer } from '../../utils/dataLayer';
import { usePaymentTracking } from './hooks/usePaymentTracking';
import { useFormTracking } from './hooks/useFormTracking';

interface CreditCardFormProps {
  formData: any;
  isSubmitting: boolean;
  mercadoPagoReady: boolean;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
  selectedProducts?: any[];
  totalAmount?: number;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  formData,
  isSubmitting,
  mercadoPagoReady,
  setIsSubmitting,
  setPaymentResult,
  setCardPaymentStatus,
  selectedProducts = [],
  totalAmount = 139.99
}) => {
  const [installments, setInstallments] = React.useState(1);
  const { toast } = useToast();
  
  // Use our new tracking hooks
  useFormTracking({ selectedProducts, totalAmount });
  
  const {
    cardData,
    errors,
    setCardField,
    validateField,
    validateAllFields,
    loadSavedCardData,
    saveFormData
  } = useCardFormValidation();

  const { paymentResult, cardPaymentStatus, handleCardPayment } = useCardPayment({
    formData,
    setIsSubmitting,
    setPaymentResult,
    setCardPaymentStatus,
    selectedProducts,
    totalAmount,
    mercadoPagoReady
  });
  
  // Use our new payment tracking hook
  usePaymentTracking({ paymentResult, totalAmount, selectedProducts });

  useEffect(() => {
    loadSavedCardData();
  }, []);

  useEffect(() => {
    if (installments > 1 && totalAmount < 10) {
      setInstallments(1);
    }
  }, [totalAmount, installments]);

  const processPayment = async () => {
    saveFormData();
    
    // Track "CompletePaymentInfo" event when proceeding to payment
    if (window.fbq) {
      window.fbq('track', 'AddPaymentInfo', {
        payment_method: 'credit_card',
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Push add payment info to dataLayer
    pushToDataLayer('adicionar_info_pagamento', {
      payment_method: 'credit_card',
      value: totalAmount,
      installments: installments
    });
    
    if (!validateAllFields()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário antes de continuar."
      });
      
      // Push validation error to dataLayer
      pushToDataLayer('erro_validacao_cartao', {
        errors: Object.keys(errors).filter(key => errors[key])
      });
      
      return;
    }
    
    // Push process payment to dataLayer
    pushToDataLayer('processar_pagamento', {
      payment_method: 'credit_card',
      value: totalAmount,
      installments: installments
    });
    
    await handleCardPayment(cardData, installments);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 border-t pt-4"
    >
      <CardSuccessState paymentResult={paymentResult} />
      
      {(!paymentResult || paymentResult.status !== 'approved') && (
        <CardPaymentWrapper
          cardData={cardData}
          errors={errors}
          installments={installments}
          paymentResult={paymentResult}
          cardPaymentStatus={cardPaymentStatus}
          isSubmitting={isSubmitting}
          totalAmount={totalAmount}
          setInstallments={setInstallments}
          setCardField={setCardField}
          validateField={validateField}
          handleCardPayment={processPayment}
        />
      )}
    </motion.div>
  );
};

export default CreditCardForm;
