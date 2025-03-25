
import React from 'react';
import { motion } from 'framer-motion';
import CardInputs from '../CardInputs';
import InstallmentSelector from '../InstallmentSelector';
import PaymentStatusIndicator from '../PaymentStatusIndicator';
import { CardData, CardFormErrors } from '../hooks/useCardFormValidation';

interface CardPaymentWrapperProps {
  cardData: CardData;
  errors: CardFormErrors;
  installments: number;
  paymentResult: any;
  cardPaymentStatus: string | null;
  isSubmitting: boolean;
  setInstallments: (value: number) => void;
  setCardField: (field: keyof CardData, value: string) => void;
  validateField: (field: string, value: string) => boolean;
  handleCardPayment: () => void;
}

const CardPaymentWrapper: React.FC<CardPaymentWrapperProps> = ({
  cardData,
  errors,
  installments,
  paymentResult,
  cardPaymentStatus,
  isSubmitting,
  setInstallments,
  setCardField,
  validateField,
  handleCardPayment
}) => {
  return (
    <>
      <CardInputs
        cardNumber={cardData.cardNumber}
        cardholderName={cardData.cardholderName}
        expirationDate={cardData.expirationDate}
        securityCode={cardData.securityCode}
        errors={errors}
        setCardNumber={(value) => setCardField('cardNumber', value)}
        setCardholderName={(value) => setCardField('cardholderName', value)}
        setExpirationDate={(value) => setCardField('expirationDate', value)}
        setSecurityCode={(value) => setCardField('securityCode', value)}
        validateField={validateField}
      />
      
      <InstallmentSelector
        installments={installments}
        setInstallments={setInstallments}
        totalAmount={paymentResult?.transactionAmount || 139.99}
      />
      
      <PaymentStatusIndicator
        paymentStatus={cardPaymentStatus}
        paymentResult={paymentResult}
      />
      
      <motion.button 
        type="button"
        className="btn-primary w-full mt-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        onClick={handleCardPayment}
      >
        {isSubmitting ? "Processando..." : "Finalizar Compra"}
      </motion.button>
    </>
  );
};

export default CardPaymentWrapper;
