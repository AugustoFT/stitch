
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { initMercadoPago } from '../utils/mercadoPago';
import CustomerInfoForm from './checkout/CustomerInfoForm';
import PaymentMethodSelector from './checkout/PaymentMethodSelector';
import CreditCardForm from './checkout/CreditCardForm';
import PixPaymentForm from './checkout/PixPaymentForm';
import PaymentSuccessMessage from './checkout/PaymentSuccessMessage';
import OrderSummary from './checkout/OrderSummary';
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

interface ProductWithQuantity {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
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
  const [productsWithQuantity, setProductsWithQuantity] = useState<ProductWithQuantity[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState(totalAmount);
  
  // Refs for tracking initialization state
  const mercadoPagoRef = useRef<any>(null);
  const productsProcessed = useRef(false);
  const customerInfoLoaded = useRef(false);
  const scriptLoaded = useRef(false);

  // Process selectedProducts to include quantities - fixing dependency array issues
  useEffect(() => {
    if (productsProcessed.current || !selectedProducts || selectedProducts.length === 0) {
      return;
    }
    
    try {
      const processedProducts = selectedProducts.map(product => ({
        id: product.id,
        title: product.title,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace('R$ ', '').replace(',', '.'))
          : product.price,
        imageUrl: product.imageUrl,
        quantity: product.quantity || 1
      }));
      
      setProductsWithQuantity(processedProducts);
      
      // Calculate total based on products and quantities
      const newTotal = processedProducts.reduce(
        (sum, product) => sum + (product.price * product.quantity), 
        0
      );
      
      setCalculatedTotal(newTotal);
      productsProcessed.current = true;
    } catch (error) {
      console.error('Error processing products:', error);
    }
  }, [selectedProducts]);

  // Load customer data from localStorage on component mount
  useEffect(() => {
    if (customerInfoLoaded.current) return;
    
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
    
    customerInfoLoaded.current = true;
  }, []);

  // Load MercadoPago SDK
  useEffect(() => {
    const loadMercadoPagoScript = () => {
      if (scriptLoaded.current) return;
      
      if (window.MercadoPago) {
        console.log('MercadoPago SDK already loaded');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        scriptLoaded.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        console.log('MercadoPago SDK loaded successfully');
        const mp = new window.MercadoPago(initMercadoPago());
        mercadoPagoRef.current = mp;
        setMercadoPagoReady(true);
        scriptLoaded.current = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
        toast.error("Falha ao carregar o processador de pagamento. Recarregue a página.");
        scriptLoaded.current = true;
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

  // Save customer info to localStorage
  const saveCustomerInfo = () => {
    if (formData.nome && formData.email) {
      const dataToSave = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        endereco: formData.endereco,
        complemento: formData.complemento,
        complemento2: formData.complemento2,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep
      };
      localStorage.setItem('customerInfo', JSON.stringify(dataToSave));
    }
  };

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
    // Save customer info when submitting form
    saveCustomerInfo();
    // Form submission now handled by the respective payment components
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
      
      {/* Show order summary if there are products selected */}
      {productsWithQuantity.length > 0 && (
        <OrderSummary 
          products={productsWithQuantity} 
          totalAmount={calculatedTotal} 
        />
      )}
      
      {/* Show success message if payment is approved */}
      <PaymentSuccessMessage paymentResult={paymentResult} />
      
      {/* Don't show the form if payment was already approved */}
      {(!paymentResult || paymentResult.status !== 'approved') && (
        <form onSubmit={handleSubmit} className="space-y-3">
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
        </form>
      )}
    </motion.div>
  );
};

export default CheckoutForm;
