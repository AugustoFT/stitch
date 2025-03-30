
import React from 'react';
import CardPaymentSuccess from '../CardPaymentSuccess';

interface CardSuccessStateProps {
  paymentResult: any;
}

const CardSuccessState: React.FC<CardSuccessStateProps> = ({ paymentResult }) => {
  if (!paymentResult || paymentResult.status !== 'approved') {
    return null;
  }
  
  return <CardPaymentSuccess paymentResult={paymentResult} />;
};

export default CardSuccessState;
