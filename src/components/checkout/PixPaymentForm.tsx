
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createPixPayment } from '../../utils/mercadoPago';

// Importando os componentes refatorados
import FormErrors from './pix/FormErrors';
import PixQRCode from './pix/PixQRCode';
import GeneratePixButton from './pix/GeneratePixButton';
import usePixFormValidation from './pix/usePixFormValidation';

interface PixPaymentFormProps {
  formData: any;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  selectedProducts?: any[];
  totalAmount?: number;
}

// Define interface for pixData to ensure consistent typing
interface PixData {
  id?: string;
  qr_code?: string;
  qr_code_base64?: string;
  status?: string;
}

const PixPaymentForm: React.FC<PixPaymentFormProps> = ({
  formData,
  isSubmitting,
  setIsSubmitting,
  selectedProducts = [],
  totalAmount = 139.99
}) => {
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);
  
  const {
    formErrors,
    validateCustomerInfo,
    getProductDescription
  } = usePixFormValidation(formData);

  const handlePixPayment = async () => {
    // Reset error state
    setPixError(null);
    
    if (!validateCustomerInfo()) {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      toast.info("Gerando QR Code PIX, aguarde...");
      
      // Save customer info to localStorage
      localStorage.setItem('customerInfo', JSON.stringify(formData));
      
      console.log('Creating PIX payment with data:', {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, '').slice(0, 3) + '***' + formData.cpf.replace(/\D/g, '').slice(-2)
      });
      console.log('Amount:', totalAmount);
      console.log('Description:', getProductDescription(selectedProducts));
      
      // Create PIX payment with dynamic amount and description
      const pixResult = await createPixPayment(
        formData,
        totalAmount,
        getProductDescription(selectedProducts)
      );
      
      console.log('PIX payment result:', pixResult);
      
      if (pixResult && (pixResult.qr_code || pixResult.qr_code_base64)) {
        // Make sure we're setting data with the correct types
        setPixData({
          id: pixResult.id, // Already a string from our API update
          qr_code: pixResult.qr_code,
          qr_code_base64: pixResult.qr_code_base64,
          status: pixResult.status
        });
        
        toast.success("QR Code PIX gerado com sucesso! Escaneie para pagar.");
      } else {
        setPixError("Erro ao gerar QR Code PIX. Verifique suas informações e tente novamente.");
        toast.error("Erro ao gerar QR Code PIX. Tente novamente.");
        console.error('Invalid PIX result:', pixResult);
      }
    } catch (error: any) {
      console.error("Erro ao processar pagamento PIX:", error);
      setPixError(error.message || "Houve um erro ao gerar o pagamento PIX");
      toast.error(error.message || "Houve um erro ao gerar o pagamento PIX. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Display errors */}
      <FormErrors errors={formErrors} pixError={pixError} />
      
      {/* Show PIX QR code if generated or button to generate */}
      {pixData ? (
        <PixQRCode pixData={pixData} totalAmount={totalAmount} />
      ) : (
        <GeneratePixButton 
          isSubmitting={isSubmitting} 
          onClick={handlePixPayment} 
        />
      )}
    </motion.div>
  );
};

export default PixPaymentForm;
