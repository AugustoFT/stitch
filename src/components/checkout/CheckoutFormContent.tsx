
import React, { useState, useEffect } from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCardForm';
import PixPaymentForm from './PixPaymentForm';
import PaymentSuccessMessage from './PaymentSuccessMessage';
import OrderSummary from './OrderSummary';
import ProductQuantitySelector from '../ProductQuantitySelector';
import { motion } from 'framer-motion';

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
  // Local state for products and total to enable dynamic updates
  const [localProducts, setLocalProducts] = useState<ProductInfo[]>([]);
  const [localTotal, setLocalTotal] = useState(calculatedTotal);

  // Initialize local state from props
  useEffect(() => {
    setLocalProducts(productsWithQuantity);
    setLocalTotal(calculatedTotal);
  }, [productsWithQuantity, calculatedTotal]);

  // Handle quantity change for a product
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedProducts = localProducts.map(product => 
      product.id === productId 
        ? { ...product, quantity: newQuantity } 
        : product
    );
    
    setLocalProducts(updatedProducts);
    
    // Recalculate total
    const newTotal = updatedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );
    
    setLocalTotal(newTotal);
  };

  // Check if payment was already approved
  if (paymentResult && paymentResult.status === 'approved') {
    return <PaymentSuccessMessage paymentResult={paymentResult} />;
  }

  // Display order summary if there are products
  const showOrderSummary = localProducts && localProducts.length > 0;

  return (
    <>
      {/* Product selection with quantity controls */}
      {showOrderSummary && (
        <div className="mb-6">
          <h3 className="font-medium text-stitch-blue mb-3 text-sm">Seus Produtos</h3>
          
          <div className="space-y-3 mb-4">
            {localProducts.map(product => (
              <motion.div 
                key={product.id} 
                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                layout
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 mr-3 bg-white p-1">
                    <img src={product.imageUrl} alt={product.title} className="h-full w-full object-contain" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-gray-600">
                      R$ {product.price.toFixed(2).replace('.', ',')} cada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ProductQuantitySelector 
                    quantity={product.quantity} 
                    onQuantityChange={(qty) => handleQuantityChange(product.id, qty)} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="flex justify-between items-center pt-2 font-medium text-stitch-blue bg-blue-50 p-3 rounded-lg"
            layout
            key={localTotal}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-gray-800">Total:</span>
            <span>R$ {localTotal.toFixed(2).replace('.', ',')}</span>
          </motion.div>
        </div>
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
          selectedProducts={localProducts}
          totalAmount={localTotal}
        />
      )}
      
      {formData.formaPagamento === 'pix' && (
        <PixPaymentForm 
          formData={formData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          selectedProducts={localProducts}
          totalAmount={localTotal}
        />
      )}
      
      <p className="text-xs text-center text-gray-500 mt-3">
        Ao clicar em "Finalizar Compra", você concorda com nossos termos e condições.
      </p>
    </>
  );
};

export default CheckoutFormContent;
