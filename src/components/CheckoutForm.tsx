
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PaymentSuccessMessage from './checkout/PaymentSuccessMessage';
import CheckoutFormContent from './checkout/content/CheckoutFormContent';
import { useCheckoutForm } from './checkout/hooks/useCheckoutForm';
import { useFormatterHandlers } from './checkout/FormatterHandlers';

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
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        num_items: selectedProducts.length,
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Push checkout view to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'iniciar_checkout',
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

  // Connect parent's callbacks to internal state handlers
  useEffect(() => {
    if (selectedProducts.length > 0) {
      // No need to sync here as the hook handles this
    }
  }, [selectedProducts]);

  // Handle product removal via internal or external handlers
  const handleRemoveProduct = (productId: number) => {
    // Track remove from cart
    if (window.fbq) {
      const product = formState.productsWithQuantity.find(p => p.id === productId);
      if (product) {
        window.fbq('track', 'RemoveFromCart', {
          content_ids: [productId],
          content_name: product.title,
          value: parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')),
          currency: 'BRL'
        });
      }
    }
    
    // Push to dataLayer
    if (window.dataLayer) {
      const product = formState.productsWithQuantity.find(p => p.id === productId);
      if (product) {
        window.dataLayer.push({
          event: 'remover_produto',
          productId,
          productName: product.title,
          productPrice: parseFloat(String(product.price).replace('R$ ', '').replace(',', '.'))
        });
      }
    }
    
    removeProduct(productId);
    if (onRemoveProduct) {
      onRemoveProduct(productId);
    }
  };

  // Handle quantity change via internal or external handlers
  const handleQuantityChange = (productId: number, quantity: number) => {
    const product = formState.productsWithQuantity.find(p => p.id === productId);
    const currentQuantity = product ? product.quantity : 0;
    
    if (quantity > currentQuantity && window.fbq) {
      // Track add to cart if increasing quantity
      window.fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: product ? product.title : 'Product',
        value: product ? parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')) : 0,
        currency: 'BRL',
        contents: [
          {
            id: productId,
            quantity: quantity - currentQuantity
          }
        ]
      });
    }
    
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: quantity > currentQuantity ? 'aumentar_quantidade' : 'diminuir_quantidade',
        productId,
        productName: product ? product.title : 'Product',
        productPrice: product ? parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')) : 0,
        oldQuantity: currentQuantity,
        newQuantity: quantity,
        quantityDelta: quantity - currentQuantity
      });
    }
    
    updateProductQuantity(productId, quantity);
    if (onQuantityChange) {
      onQuantityChange(productId, quantity);
    }
  };

  const enhancedHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track lead event when form is submitted
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Checkout Form',
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Validate form data
    const isFormValid = validateCheckoutForm(formState.formData);
    
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'finalizar_compra',
        products: formState.productsWithQuantity.map(p => ({
          id: p.id,
          name: p.title,
          price: parseFloat(String(p.price).replace('R$ ', '').replace(',', '.')),
          quantity: p.quantity
        })),
        total: formState.calculatedTotal,
        paymentMethod: formState.formData.formaPagamento,
        isFormValid
      });
    }
    
    saveCustomerInfo();
    handleSubmit(e);
  };
  
  // Simple validation function to check if the form is filled out properly
  const validateCheckoutForm = (formData: any) => {
    const requiredFields = ['nome', 'email', 'telefone', 'cpf', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado', 'formaPagamento'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  };

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
