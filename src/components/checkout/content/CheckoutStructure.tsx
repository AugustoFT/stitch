
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck } from 'lucide-react';
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
  if (paymentResult && paymentResult.status === 'approved') {
    return <PaymentSuccessMessage paymentResult={paymentResult} />;
  }

  const hasKitCompleto = products.some(p => p.title && p.title.includes("Kit Completo"));

  return (
    <>
      {hasKitCompleto && (
        <motion.div 
          className="bg-stitch-yellow/20 p-3 rounded-lg border border-stitch-yellow mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="text-stitch-yellow h-5 w-5" />
            <span className="font-bold text-stitch-dark">Kit Exclusivo Stitch</span>
          </div>
          <p className="text-xs text-gray-700">Aproveite esta oferta especial por tempo limitado!</p>
        </motion.div>
      )}
      
      {/* Cart Display moved to the top for independent interaction */}
      <CartDisplay 
        products={products}
        total={total}
        onRemoveProduct={onRemoveProduct}
        onQuantityChange={onQuantityChange}
      />
      
      {/* Customer info form section */}
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
      
      {/* Selos de segurança */}
      <div className="my-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium">Compra Segura</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium">Ambiente Protegido</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium">Dados Criptografados</span>
          </div>
        </div>
      </div>
      
      <CheckoutTerms />
    </>
  );
};

export default CheckoutStructure;
