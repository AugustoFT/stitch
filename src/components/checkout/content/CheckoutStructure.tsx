
import React from 'react';
import PaymentSuccessMessage from '../PaymentSuccessMessage';
import CartDisplay from '../cart/CartDisplay';
import CustomerInfoForm from '../CustomerInfoForm';
import PaymentSection from '../payment/PaymentSection';
import CheckoutTerms from '../CheckoutTerms';

interface ProductInfo {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CheckoutStructureProps {
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
  products: ProductInfo[];
  total: number;
  onRemoveProduct?: (productId: number) => void;
  onQuantityChange?: (productId: number, quantity: number) => void;
}

const CheckoutStructure: React.FC<CheckoutStructureProps> = ({
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
  products,
  total,
  onRemoveProduct,
  onQuantityChange
}) => {
  // Check if payment was already approved
  if (paymentResult && paymentResult.status === 'approved') {
    return <PaymentSuccessMessage paymentResult={paymentResult} />;
  }

  return (
    <>
      {/* Cart display component */}
      <CartDisplay 
        products={products}
        total={total}
        onRemoveProduct={onRemoveProduct}
        onQuantityChange={onQuantityChange}
      />
      
      {/* Customer information form */}
      <CustomerInfoForm 
        formData={formData}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleCPFChange={handleCPFChange}
        handleCEPChange={handleCEPChange}
      />
      
      {/* Payment section */}
      <PaymentSection 
        formData={formData}
        isSubmitting={isSubmitting}
        cardFormVisible={cardFormVisible}
        mercadoPagoReady={mercadoPagoReady}
        paymentResult={paymentResult}
        setIsSubmitting={setIsSubmitting}
        setPaymentResult={setPaymentResult}
        setCardPaymentStatus={setCardPaymentStatus}
        handlePaymentMethodChange={handlePaymentMethodChange}
        selectedProducts={products}
        totalAmount={total}
      />
      
      {/* Terms and conditions */}
      <CheckoutTerms />
    </>
  );
};

export default CheckoutStructure;
