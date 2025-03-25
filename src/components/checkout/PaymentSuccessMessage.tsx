
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PaymentSuccessMessageProps {
  paymentResult: any;
}

const PaymentSuccessMessage: React.FC<PaymentSuccessMessageProps> = ({ paymentResult }) => {
  if (!paymentResult || paymentResult.status !== 'approved') return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4 }}
      className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center"
    >
      <div className="bg-green-100 p-3 rounded-full mb-3">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-green-800 font-semibold text-lg mb-1">Pagamento Aprovado!</h3>
      <p className="text-green-700 text-center">
        Sua compra foi processada com sucesso. Você receberá um e-mail com os detalhes.
      </p>
      {paymentResult.id && (
        <p className="text-xs text-green-600 mt-2">
          ID da transação: {paymentResult.id}
        </p>
      )}
      {paymentResult.orderId && (
        <p className="text-xs text-green-600 mt-1">
          Número do pedido: {paymentResult.orderId}
        </p>
      )}
    </motion.div>
  );
};

export default PaymentSuccessMessage;
