
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
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
  
  useEffect(() => {
    console.log('FORÇANDO MODO DE PRODUÇÃO!');
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
    
    if (!validateAllFields()) {
      toast.error("Por favor, corrija os erros no formulário antes de continuar.");
      return;
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
