
import React from 'react';
import { motion } from 'framer-motion';

interface PaymentStatusIndicatorProps {
  paymentStatus: string | null;
  paymentResult: any;
}

const PaymentStatusIndicator: React.FC<PaymentStatusIndicatorProps> = ({
  paymentStatus,
  paymentResult
}) => {
  if (!paymentStatus) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-3 rounded-lg text-center ${
        paymentStatus === 'approved' 
          ? 'bg-green-100 text-green-800' 
          : paymentStatus === 'in_process' || paymentStatus === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {paymentResult && paymentResult.message}
    </motion.div>
  );
};

export default PaymentStatusIndicator;
