
import React, { useState, useEffect } from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import PaymentSuccessMessage from './PaymentSuccessMessage';
import CartDisplay from './cart/CartDisplay';
import PaymentSection from './payment/PaymentSection';
import CheckoutTerms from './CheckoutTerms';

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
  onRemoveProduct?: (productId: number) => void;
  onQuantityChange?: (productId: number, quantity: number) => void;
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
  calculatedTotal,
  onRemoveProduct,
  onQuantityChange
}) => {
  // State for real-time cart display
  const [cartProducts, setCartProducts] = useState<ProductInfo[]>(productsWithQuantity);
  const [cartTotal, setCartTotal] = useState(calculatedTotal);

  // Sync state with props when they change
  useEffect(() => {
    setCartProducts(productsWithQuantity);
    setCartTotal(calculatedTotal);
  }, [productsWithQuantity, calculatedTotal]);

  // Handle product removal
  const handleRemoveProduct = (productId: number) => {
    if (onRemoveProduct) {
      onRemoveProduct(productId);
    }
  };

  // Handle quantity change in the cart
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(productId, newQuantity);
    }
  };

  // Check if payment was already approved
  if (paymentResult && paymentResult.status === 'approved') {
    return <PaymentSuccessMessage paymentResult={paymentResult} />;
  }

  return (
    <>
      {/* Cart display component */}
      <CartDisplay 
        products={cartProducts}
        total={cartTotal}
        onRemoveProduct={handleRemoveProduct}
        onQuantityChange={handleQuantityChange}
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
        selectedProducts={cartProducts}
        totalAmount={cartTotal}
      />
      
      {/* Terms and conditions */}
      <CheckoutTerms />
    </>
  );
};

export default CheckoutFormContent;
