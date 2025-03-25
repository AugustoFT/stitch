
import React from 'react';
import PaymentMethodSelector from '../PaymentMethodSelector';
import CreditCardForm from '../CreditCardForm';
import PixPaymentForm from '../PixPaymentForm';

interface ProductInfo {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface PaymentSectionProps {
  formData: any;
  isSubmitting: boolean;
  cardFormVisible: boolean;
  mercadoPagoReady: boolean;
  paymentResult: any;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
  handlePaymentMethodChange: (method: string) => void;
  selectedProducts: ProductInfo[];
  totalAmount: number;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  isSubmitting,
  cardFormVisible,
  mercadoPagoReady,
  paymentResult,
  setIsSubmitting,
  setPaymentResult,
  setCardPaymentStatus,
  handlePaymentMethodChange,
  selectedProducts,
  totalAmount
}) => {
  return (
    <>
      <PaymentMethodSelector 
        formaPagamento={formData.formaPagamento}
        onChange={handlePaymentMethodChange}
      />
      
      {cardFormVisible && (
        <CreditCardForm 
          formData={formData}
          isSubmitting={isSubmitting}
          mercadoPagoReady={mercadoPagoReady}
          setIsSubmitting={setIsSubmitting}
          setPaymentResult={setPaymentResult}
          setCardPaymentStatus={setCardPaymentStatus}
          selectedProducts={selectedProducts}
          totalAmount={totalAmount}
        />
      )}
      
      {formData.formaPagamento === 'pix' && (
        <PixPaymentForm 
          formData={formData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          selectedProducts={selectedProducts}
          totalAmount={totalAmount}
        />
      )}
    </>
  );
};

export default PaymentSection;
