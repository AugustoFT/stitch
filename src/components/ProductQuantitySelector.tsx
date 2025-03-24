
import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({ 
  quantity, 
  onQuantityChange,
  maxQuantity = 10
}) => {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={decreaseQuantity}
        disabled={quantity <= 1}
        className={`w-8 h-8 flex items-center justify-center rounded-l-md ${
          quantity <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-stitch-blue text-white'
        }`}
        aria-label="Diminuir quantidade"
      >
        <Minus size={16} />
      </motion.button>
      
      <motion.div 
        className="w-12 h-8 flex items-center justify-center border-y border-gray-300 bg-white text-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        key={quantity}
      >
        {quantity}
      </motion.div>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={increaseQuantity}
        disabled={quantity >= maxQuantity}
        className={`w-8 h-8 flex items-center justify-center rounded-r-md ${
          quantity >= maxQuantity ? 'bg-gray-200 text-gray-400' : 'bg-stitch-blue text-white'
        }`}
        aria-label="Aumentar quantidade"
      >
        <Plus size={16} />
      </motion.button>
    </div>
  );
};

export default ProductQuantitySelector;
