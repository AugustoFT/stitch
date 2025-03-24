
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';
import { createPixPayment } from '../../utils/mercadoPago';

interface PixPaymentFormProps {
  formData: any;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const PixPaymentForm: React.FC<PixPaymentFormProps> = ({
  formData,
  isSubmitting,
  setIsSubmitting
}) => {
  const [pixData, setPixData] = React.useState<{ qr_code?: string; qr_code_base64?: string } | null>(null);

  const handlePixPayment = async () => {
    setIsSubmitting(true);
    
    try {
      toast.info("Gerando QR Code PIX, aguarde...");
      
      // Create PIX payment
      const pixResult = await createPixPayment(formData);
      
      if (pixResult && (pixResult.qr_code || pixResult.qr_code_base64)) {
        setPixData(pixResult);
        toast.success("QR Code PIX gerado com sucesso! Escaneie para pagar.");
      } else {
        toast.error("Erro ao gerar QR Code PIX. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      toast.error("Houve um erro ao gerar o pagamento PIX. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Show PIX QR code if generated */}
      {pixData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50"
        >
          <p className="font-medium mb-3 text-center">Escaneie o QR Code para pagar</p>
          
          {pixData.qr_code_base64 ? (
            <img 
              src={`data:image/png;base64,${pixData.qr_code_base64}`} 
              alt="QR Code PIX" 
              className="w-48 h-48 mb-2"
            />
          ) : pixData.qr_code ? (
            <div className="text-center p-3 bg-white rounded border mb-2">
              <QrCode className="w-36 h-36 mx-auto text-stitch-blue" />
              <p className="text-xs text-gray-500 mt-2">QR Code PIX</p>
            </div>
          ) : null}
          
          <p className="text-sm text-gray-600 text-center mt-2">Após o pagamento, você receberá a confirmação por email</p>
        </motion.div>
      ) : (
        <motion.button 
          type="button"
          className="btn-primary w-full mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          onClick={handlePixPayment}
        >
          {isSubmitting ? "Gerando PIX..." : "Gerar QR Code PIX"}
        </motion.button>
      )}
    </div>
  );
};

export default PixPaymentForm;
