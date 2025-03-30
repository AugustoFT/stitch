
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import CardPaymentSuccess from './CardPaymentSuccess';
import CardPaymentWrapper from './card/CardPaymentWrapper';
import { useCardFormValidation } from './hooks/useCardFormValidation';
import { useCardPayment } from './hooks/useCardPayment';

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

declare global {
  interface Window {
    fbq: any;
    dataLayer: any[];
  }
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
  const [installments, setInstallments] = useState(1);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('FORÇANDO MODO DE PRODUÇÃO!');
    
    // Track ViewContent event when form is shown
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: selectedProducts.map(p => p.id),
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'view_payment_form',
        payment_method: 'credit_card',
        products: selectedProducts.map(p => ({
          id: p.id,
          name: p.title,
          price: p.price,
          quantity: p.quantity
        })),
        total: totalAmount
      });
    }
  }, []);
  
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
  
  // Track successful purchases
  useEffect(() => {
    if (paymentResult && paymentResult.status === 'approved') {
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: totalAmount,
          currency: 'BRL',
          content_ids: selectedProducts.map(p => p.id),
          content_type: 'product',
          num_items: selectedProducts.reduce((acc, curr) => acc + curr.quantity, 0)
        });
      }
      
      // Push successful purchase to dataLayer
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'compra_finalizada',
          payment_method: 'credit_card',
          transaction_id: paymentResult.id,
          order_id: paymentResult.orderId,
          products: selectedProducts.map(p => ({
            id: p.id,
            name: p.title,
            price: p.price,
            quantity: p.quantity
          })),
          total: totalAmount,
          installments: installments,
          shipping: 0,
          tax: 0
        });
      }
    }
  }, [paymentResult]);

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
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'adicionar_info_pagamento',
        payment_method: 'credit_card',
        value: totalAmount,
        installments: installments
      });
    }
    
    if (!validateAllFields()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário antes de continuar."
      });
      
      // Push validation error to dataLayer
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'erro_validacao_cartao',
          errors: Object.keys(errors).filter(key => errors[key])
        });
      }
      
      return;
    }
    
    // Push process payment to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'processar_pagamento',
        payment_method: 'credit_card',
        value: totalAmount,
        installments: installments
      });
    }
    
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
      <CardPaymentSuccess paymentResult={paymentResult} />
      
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
