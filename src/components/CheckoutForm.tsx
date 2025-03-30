
import React from 'react';
import { motion } from 'framer-motion';
import PaymentSuccessMessage from './checkout/PaymentSuccessMessage';
import CheckoutFormContent from './checkout/content/CheckoutFormContent';
import { useCheckoutForm } from './checkout/hooks/useCheckoutForm';
import { useFormatterHandlers } from './checkout/FormatterHandlers';
import { useCheckoutTracking } from './checkout/hooks/useCheckoutTracking';
import { useProductInteractions } from './checkout/hooks/useProductInteractions';
import { useSubmitHandler } from './checkout/hooks/useSubmitHandler';

// Declare MercadoPago in the window object
declare global {
  interface Window {
    MercadoPago: any;
    fbq: any;
    dataLayer: any[];
  }
}

interface CheckoutFormProps {
  selectedProducts?: any[];
  totalAmount?: number;
  onRemoveProduct?: (productId: number) => void;
  onQuantityChange?: (productId: number, quantity: number) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  selectedProducts = [], 
  totalAmount = 139.99,
  onRemoveProduct,
  onQuantityChange
}) => {
  const {
    formState,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    saveCustomerInfo,
    setIsSubmitting,
    setPaymentResult,
    setCardPaymentStatus,
    updateProductQuantity,
    removeProduct
  } = useCheckoutForm(selectedProducts, totalAmount);

  // Track checkout view
  useCheckoutTracking({ selectedProducts, totalAmount });

  // Use formatter handlers for formatted inputs
  const { 
    handleCPFChange, 
    handlePhoneChange, 
    handleCEPChange 
  } = useFormatterHandlers({
    formData: formState.formData,
    handleChange,
    setFormData: (updater) => {
      const newFormData = updater(formState.formData);
      formState.formData = newFormData;
    }
  });

  // Product interactions handling
  const { handleRemoveProduct, handleQuantityChange } = useProductInteractions({
    onRemoveProduct,
    onQuantityChange,
    productsWithQuantity: formState.productsWithQuantity
  });

  // Form submission handling
  const { enhancedHandleSubmit } = useSubmitHandler({
    formState,
    saveCustomerInfo,
    handleSubmit
  });

  return (
    <motion.div 
      className="glass-card p-5 rounded-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-xl font-display font-bold text-stitch-pink mb-4 text-center">
        Preencha para comprar
      </h2>
      
      <div className="text-center mb-4">
        <div className="inline-block bg-stitch-pink text-white text-xs font-bold py-1 px-3 rounded-full mb-2">
          Promoção por tempo limitado!
        </div>
      </div>
      
      {/* Show success message if payment is approved */}
      <PaymentSuccessMessage paymentResult={formState.paymentResult} />
      
      {/* The form is now wrapped in a form tag, but the cart functionality is independent */}
      {(!formState.paymentResult || formState.paymentResult.status !== 'approved') && (
        <form onSubmit={enhancedHandleSubmit} className="space-y-3">
          <CheckoutFormContent
            formData={formState.formData}
            isSubmitting={formState.isSubmitting}
            cardFormVisible={formState.cardFormVisible}
            mercadoPagoReady={formState.mercadoPagoReady}
            paymentResult={formState.paymentResult}
            setIsSubmitting={setIsSubmitting}
            setPaymentResult={setPaymentResult}
            setCardPaymentStatus={setCardPaymentStatus}
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
            handleCPFChange={handleCPFChange}
            handleCEPChange={handleCEPChange}
            handlePaymentMethodChange={handlePaymentMethodChange}
            productsWithQuantity={formState.productsWithQuantity}
            calculatedTotal={formState.calculatedTotal}
            onRemoveProduct={handleRemoveProduct}
            onQuantityChange={handleQuantityChange}
          />
        </form>
      )}
    </motion.div>
  );
};

export default CheckoutForm;
