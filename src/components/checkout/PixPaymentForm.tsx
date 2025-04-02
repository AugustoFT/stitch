
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createPixPayment } from '../../utils/mercadoPago';
import { createNewOrder } from '../../utils/orders/orderManager';

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
  orderId?: string;
  tracking_code?: string;
}

const PixPaymentForm: React.FC<PixPaymentFormProps> = ({
  formData,
  isSubmitting,
  setIsSubmitting,
  selectedProducts = [],
  totalAmount
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
      console.log('Products:', selectedProducts);
      
      // Create PIX payment with dynamic amount, description and products
      const pixResult = await createPixPayment(
        formData,
        totalAmount,
        getProductDescription(selectedProducts),
        selectedProducts
      );
      
      console.log('PIX payment result:', pixResult);
      
      if (pixResult && (pixResult.qr_code || pixResult.qr_code_base64)) {
        // Preparar produtos para o pedido
        const orderProducts = selectedProducts.map(product => {
          // Garantir que o preço seja processado corretamente
          let productPrice;
          if (typeof product.price === 'string') {
            productPrice = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
          } else if (typeof product.price === 'number') {
            productPrice = product.price;
          } else {
            console.warn('Formato de preço inesperado:', product.price);
            productPrice = 0;
          }

          return {
            id: product.id,
            name: product.title,
            quantity: product.quantity,
            price: productPrice,
            imageUrl: product.imageUrl
          };
        });
        
        // Preparar informações do cliente
        const customerInfo = {
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          address: formData.endereco,
          city: formData.cidade,
          state: formData.estado,
          zip: formData.cep,
          cpf: formData.cpf
        };
        
        try {
          // Criar pedido no sistema com status pendente
          const order = await createNewOrder(
            orderProducts,
            customerInfo,
            'pix',
            pixResult.id
          );
          
          console.log('Pedido PIX criado com sucesso:', order);
          
          // Gerar código de rastreamento aleatório para fins de demonstração
          const trackingCode = 'BR' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0') + 'SP';
          
          // Adicionar informações ao resultado do PIX
          pixResult.orderId = order.id;
          pixResult.tracking_code = trackingCode;
          
          toast.success("Pedido registrado com sucesso!");
          toast.success(`Após o pagamento, use o código de rastreio: ${trackingCode}`);
        } catch (orderError) {
          console.error('Erro ao criar pedido PIX:', orderError);
          toast.error("QR Code gerado, mas houve um erro ao registrar o pedido. Entre em contato com o suporte.");
        }
      
        // Make sure we're setting data with the correct types
        setPixData({
          id: pixResult.id,
          qr_code: pixResult.qr_code,
          qr_code_base64: pixResult.qr_code_base64,
          status: pixResult.status,
          orderId: pixResult.orderId,
          tracking_code: pixResult.tracking_code
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
