import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { initMercadoPago } from '../utils/mercadoPago';
import CustomerInfoForm from './checkout/CustomerInfoForm';
import PaymentMethodSelector from './checkout/PaymentMethodSelector';
import CreditCardForm from './checkout/CreditCardForm';
import PixPaymentForm from './checkout/PixPaymentForm';
import PaymentSuccessMessage from './checkout/PaymentSuccessMessage';
import { formatCPF, formatPhoneNumber, formatCEP } from './checkout/InputFormatters';

// Declare MercadoPago in the window object
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface CheckoutFormProps {
  selectedProducts?: any[];
  totalAmount?: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  selectedProducts = [], 
  totalAmount = 139.99 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    complemento: '',
    complemento2: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    cpf: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardFormVisible, setCardFormVisible] = useState(true);
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [cardPaymentStatus, setCardPaymentStatus] = useState<string | null>(null);
  
  // Refs for the Mercado Pago SDK
  const mercadoPagoRef = useRef<any>(null);

  // Load customer data from localStorage on component mount
  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedData = JSON.parse(savedCustomerInfo);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData,
          // Keep current payment method
          formaPagamento: prevData.formaPagamento
        }));
      } catch (e) {
        console.error('Error parsing saved customer data', e);
      }
    }
  }, []);

  // Load MercadoPago SDK
  useEffect(() => {
    const loadMercadoPagoScript = () => {
      if (window.MercadoPago) {
        // SDK already loaded
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        console.log('MercadoPago SDK already loaded');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        console.log('MercadoPago SDK loaded successfully');
      };
      document.body.appendChild(script);
    };

    loadMercadoPagoScript();
  }, []);

  // Handle form payment method change
  useEffect(() => {
    // Show card form only when card is selected
    setCardFormVisible(formData.formaPagamento === 'cartao');
    
    // Reset payment result when switching payment methods
    setPaymentResult(null);
    setCardPaymentStatus(null);
  }, [formData.formaPagamento]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (formData.nome && formData.email) {
      localStorage.setItem('customerInfo', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle formatted input changes
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formattedValue }));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formattedValue }));
  };
  
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: formattedValue }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ ...prev, formaPagamento: method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission now handled by the respective payment components
  };

  // Show product summary
  const renderProductSummary = () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Pelúcia Stitch</p>
          <p className="text-sm text-blue-700">R$ {totalAmount.toFixed(2).replace('.', ',')}</p>
        </div>
      );
    }
    
    return (
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Resumo do pedido</h3>
        {selectedProducts.map((product, index) => (
          <div key={index} className="flex justify-between text-sm mb-1">
            <span className="text-blue-800">{product.title}</span>
            <span className="text-blue-700">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-blue-100 flex justify-between font-medium">
          <span className="text-blue-800">Total:</span>
          <span className="text-blue-800">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="glass-card p-6 rounded-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-2xl font-display font-bold text-stitch-pink mb-6 text-center">
        Preencha para comprar
      </h2>
      
      <div className="text-center mb-6">
        <div className="inline-block bg-stitch-pink text-white text-sm font-bold py-1 px-4 rounded-full mb-2">
          Promoção por tempo limitado!
        </div>
      </div>
      
      {/* Show order summary */}
      {renderProductSummary()}
      
      {/* Show success message if payment is approved */}
      <PaymentSuccessMessage paymentResult={paymentResult} />
      
      {/* Don't show the form if payment was already approved */}
      {(!paymentResult || paymentResult.status !== 'approved') && (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Ao clicar em "Finalizar Compra", você concorda com nossos termos e condições.
          </p>
        </form>
      )}
    </motion.div>
  );
};

export default CheckoutForm;
