
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';
import { createPixPayment } from '../../utils/mercadoPago';

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
  const [pixData, setPixData] = React.useState<PixData | null>(null);
  const [formErrors, setFormErrors] = React.useState<string[]>([]);
  const [pixError, setPixError] = React.useState<string | null>(null);

  // Validate customer information before generating PIX
  const validateCustomerInfo = () => {
    const errors = [];
    
    if (!formData.nome || formData.nome.length < 3) {
      errors.push('Nome completo é obrigatório');
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      errors.push('Email válido é obrigatório');
    }
    
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      errors.push('CPF válido é obrigatório');
    }
    
    if (!formData.endereco) {
      errors.push('Endereço é obrigatório');
    }
    
    if (!formData.cidade) {
      errors.push('Cidade é obrigatória');
    }
    
    if (!formData.estado) {
      errors.push('Estado é obrigatório');
    }
    
    if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
      errors.push('CEP válido é obrigatório');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const getProductDescription = () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return 'Pelúcia Stitch';
    }
    
    if (selectedProducts.length === 1) {
      return selectedProducts[0].title;
    }
    
    return `Compra Stitch (${selectedProducts.length} itens)`;
  };

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
      console.log('Description:', getProductDescription());
      
      // Create PIX payment with dynamic amount and description
      const pixResult = await createPixPayment(
        formData,
        totalAmount,
        getProductDescription()
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
      {/* Display form validation errors */}
      {formErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p className="text-red-700 font-medium mb-1 text-sm">Por favor, corrija os seguintes erros:</p>
          <ul className="text-red-600 text-xs list-disc pl-5">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Display PIX generation error */}
      {pixError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p className="text-red-700 font-medium text-sm">{pixError}</p>
        </motion.div>
      )}
      
      {/* Show PIX QR code if generated */}
      {pixData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50"
        >
          <p className="font-medium mb-3 text-center text-sm">Escaneie o QR Code para pagar</p>
          
          {pixData.qr_code_base64 ? (
            <img 
              src={`data:image/png;base64,${pixData.qr_code_base64}`} 
              alt="QR Code PIX" 
              className="w-40 h-40 mb-2"
            />
          ) : pixData.qr_code ? (
            <div className="text-center p-3 bg-white rounded border mb-2">
              <p className="text-xs font-mono overflow-auto whitespace-pre-wrap max-w-xs break-all">{pixData.qr_code}</p>
              <p className="text-xs text-gray-500 mt-2">Copie este código para pagar</p>
            </div>
          ) : null}
          
          <p className="text-xs text-gray-600 text-center mt-2">Após o pagamento, você receberá a confirmação por email</p>
          <p className="text-sm font-medium text-stitch-blue mt-3">Valor a pagar: R$ {totalAmount.toFixed(2).replace('.', ',')}</p>
          
          {pixData.id && (
            <p className="text-xs text-gray-500 mt-2">ID da transação: {pixData.id}</p>
          )}
        </motion.div>
      ) : (
        <motion.button 
          type="button"
          className="btn-primary w-full mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          onClick={handlePixPayment}
        >
          {isSubmitting ? "Gerando PIX..." : (
            <span className="flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              Gerar QR Code PIX
            </span>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default PixPaymentForm;
