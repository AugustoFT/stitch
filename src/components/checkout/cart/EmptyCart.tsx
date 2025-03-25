
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const EmptyCart: React.FC = () => {
  return (
    <motion.div 
      className="bg-blue-50 p-4 rounded-lg mb-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 text-sm">Seu carrinho está vazio</p>
      <p className="text-gray-500 text-xs mt-1">Selecione produtos para continuar</p>
    </motion.div>
  );
};

export default EmptyCart;
