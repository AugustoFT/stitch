
import { useState, useEffect } from 'react';

export const usePaymentState = (initialPaymentMethod: string = 'cartao') => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardFormVisible, setCardFormVisible] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [cardPaymentStatus, setCardPaymentStatus] = useState<string | null>(null);

  // Update card form visibility based on payment method
  useEffect(() => {
    setCardFormVisible(initialPaymentMethod === 'cartao');
  }, [initialPaymentMethod]);

  return {
    isSubmitting,
    cardFormVisible,
    paymentResult,
    cardPaymentStatus,
    setIsSubmitting,
    setPaymentResult,
    setCardPaymentStatus
  };
};
