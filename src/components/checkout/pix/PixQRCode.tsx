
import React from 'react';
import { motion } from 'framer-motion';

interface PixData {
  id?: string;
  qr_code?: string;
  qr_code_base64?: string;
  status?: string;
}

interface PixQRCodeProps {
  pixData: PixData;
  totalAmount: number;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ pixData, totalAmount }) => {
  return (
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
  );
};

export default PixQRCode;
