
import React from 'react';
import { motion } from 'framer-motion';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PixQRCodeProps {
  pixData: {
    qr_code?: string;
    qr_code_base64?: string;
    id?: string;
    orderId?: string;
    tracking_code?: string;
  };
  totalAmount: number;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ pixData, totalAmount }) => {
  const handleCopyQRCode = () => {
    if (pixData.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code)
        .then(() => toast.success("Código PIX copiado!"))
        .catch(() => toast.error("Erro ao copiar código PIX"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-stitch-blue rounded-lg p-4 flex flex-col items-center"
    >
      <h3 className="text-lg font-semibold mb-2 text-stitch-pink">PIX Gerado com Sucesso!</h3>
      
      <p className="text-sm text-gray-600 mb-2 text-center">
        Escaneie o QR Code abaixo ou copie o código PIX para realizar o pagamento de R$ {totalAmount.toFixed(2).replace('.', ',')}
      </p>
      
      {pixData.qr_code_base64 && (
        <div className="bg-white p-2 border border-gray-200 rounded-lg mb-3">
          <img 
            src={`data:image/png;base64,${pixData.qr_code_base64}`}
            alt="QR Code PIX" 
            className="w-48 h-48"
          />
        </div>
      )}
      
      {pixData.qr_code && (
        <div className="w-full relative">
          <textarea
            readOnly
            value={pixData.qr_code}
            className="w-full p-2 bg-gray-50 text-gray-800 border border-gray-300 rounded text-xs h-24 resize-none"
          />
          <button
            onClick={handleCopyQRCode}
            className="absolute top-2 right-2 p-1 bg-stitch-pink text-white rounded-md hover:bg-stitch-blue transition-colors"
            title="Copiar código PIX"
          >
            <CopyIcon size={16} />
          </button>
        </div>
      )}
      
      <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-700 w-full">
        <p className="font-medium mb-1">Importante:</p>
        <ul className="list-disc pl-5 text-xs space-y-1">
          <li>O pagamento via PIX é instantâneo</li>
          <li>Após o pagamento, você receberá a confirmação por e-mail</li>
          <li>Este QR Code é válido por 30 minutos</li>
        </ul>
      </div>

      {pixData.orderId && (
        <p className="text-xs text-gray-600 mt-2">
          Número do pedido: {pixData.orderId}
        </p>
      )}

      {pixData.tracking_code && (
        <p className="text-xs text-gray-600 mt-1">
          Código de rastreio: {pixData.tracking_code}
        </p>
      )}
    </motion.div>
  );
};

export default PixQRCode;
