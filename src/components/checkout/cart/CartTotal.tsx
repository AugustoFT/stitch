
import React from 'react';
import { motion } from 'framer-motion';

interface CartTotalProps {
  total: number;
}

const CartTotal: React.FC<CartTotalProps> = ({ total }) => {
  return (
    <motion.div 
      className="flex justify-between items-center pt-2 font-medium bg-blue-50 p-3 rounded-lg"
      layout
      key={total}
      initial={{ opacity: 0.5, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-gray-800">Total:</span>
      <span className="text-stitch-blue font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
    </motion.div>
  );
};

export default CartTotal;
