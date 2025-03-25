
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface CardPaymentSuccessProps {
  paymentResult: any;
}

const CardPaymentSuccess: React.FC<CardPaymentSuccessProps> = ({ paymentResult }) => {
  if (!paymentResult) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg p-4 mb-4"
      style={{
        borderColor: 
          paymentResult.status === 'approved' ? '#10b981' :
          paymentResult.status === 'in_process' || paymentResult.status === 'pending' ? '#f59e0b' : 
          '#ef4444',
        backgroundColor: 
          paymentResult.status === 'approved' ? '#d1fae5' :
          paymentResult.status === 'in_process' || paymentResult.status === 'pending' ? '#fef3c7' : 
          '#fee2e2',
      }}
    >
      <div className="flex items-start gap-3">
        {paymentResult.status === 'approved' && (
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
        )}
        {(paymentResult.status === 'in_process' || paymentResult.status === 'pending') && (
          <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        )}
        {(paymentResult.status === 'rejected' || paymentResult.status === 'error') && (
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        
        <div>
          <h3 className={`font-medium ${
            paymentResult.status === 'approved' ? 'text-green-800' :
            paymentResult.status === 'in_process' || paymentResult.status === 'pending' ? 'text-yellow-800' : 
            'text-red-800'
          }`}>
            {paymentResult.status === 'approved' ? 'Pagamento Aprovado' :
             paymentResult.status === 'in_process' || paymentResult.status === 'pending' ? 'Pagamento em Processamento' : 
             'Pagamento Recusado'}
          </h3>
          
          <p className={`text-sm ${
            paymentResult.status === 'approved' ? 'text-green-700' :
            paymentResult.status === 'in_process' || paymentResult.status === 'pending' ? 'text-yellow-700' : 
            'text-red-700'
          }`}>
            {paymentResult.message || 'Processando seu pagamento...'}
          </p>
          
          {paymentResult.id && (
            <p className="text-xs mt-2 text-gray-600">
              ID da transação: {paymentResult.id}
            </p>
          )}
          
          {paymentResult.orderId && (
            <p className="text-xs mt-1 text-gray-600">
              Número do pedido: {paymentResult.orderId}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CardPaymentSuccess;
