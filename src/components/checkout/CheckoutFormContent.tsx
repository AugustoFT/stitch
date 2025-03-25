
import React from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCardForm';
import PixPaymentForm from './PixPaymentForm';
import PaymentSuccessMessage from './PaymentSuccessMessage';
import OrderSummary from './OrderSummary';

interface ProductInfo {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CheckoutFormContentProps {
  formData: any;
  isSubmitting: boolean;
  cardFormVisible: boolean;
  mercadoPagoReady: boolean;
  paymentResult: any;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCPFChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentMethodChange: (method: string) => void;
  productsWithQuantity: ProductInfo[];
  calculatedTotal: number;
}

const CheckoutFormContent: React.FC<CheckoutFormContentProps> = ({
  formData,
  isSubmitting,
  cardFormVisible,
  mercadoPagoReady,
  paymentResult,
  setIsSubmitting,
  setPaymentResult,
  setCardPaymentStatus,
  handleChange,
  handlePhoneChange,
  handleCPFChange,
  handleCEPChange,
  handlePaymentMethodChange,
  productsWithQuantity,
  calculatedTotal
}) => {
  // Check if payment was already approved
  if (paymentResult && paymentResult.status === 'approved') {
    return <PaymentSuccessMessage paymentResult={paymentResult} />;
  }

  // Display order summary if there are products
  const showOrderSummary = productsWithQuantity && productsWithQuantity.length > 0;

  return (
    <>
      {/* Show order summary at the top of the form */}
      {showOrderSummary && (
        <OrderSummary 
          products={productsWithQuantity} 
          totalAmount={calculatedTotal} 
        />
      )}
      
      {/* Customer information form */}
      <CustomerInfoForm 
        formData={formData}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleCPFChange={handleCPFChange}
        handleCEPChange={handleCEPChange}
      />
      
      {/* Payment method selector */}
      <PaymentMethodSelector 
        formaPagamento={formData.formaPagamento}
        onChange={handlePaymentMethodChange}
      />
      
      {/* Payment forms */}
      {cardFormVisible && (
        <CreditCardForm 
          formData={formData}
          isSubmitting={isSubmitting}
          mercadoPagoReady={mercadoPagoReady}
          setIsSubmitting={setIsSubmitting}
          setPaymentResult={setPaymentResult}
          setCardPaymentStatus={setCardPaymentStatus}
          selectedProducts={productsWithQuantity}
          totalAmount={calculatedTotal}
        />
      )}
      
      {formData.formaPagamento === 'pix' && (
        <PixPaymentForm 
          formData={formData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          selectedProducts={productsWithQuantity}
          totalAmount={calculatedTotal}
        />
      )}
      
      <p className="text-xs text-center text-gray-500 mt-3">
        Ao clicar em "Finalizar Compra", você concorda com nossos termos e condições.
      </p>
    </>
  );
};

export default CheckoutFormContent;
