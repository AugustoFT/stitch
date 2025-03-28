
import React from 'react';
import { motion } from 'framer-motion';

interface ProductPriceProps {
  price: string;
  originalPrice: string;
  quantity: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ price, originalPrice, quantity }) => {
  // Convert price string to number (removing "R$ " and replacing comma with dot)
  const priceStr = typeof price === 'string' ? price : String(price);
  const priceNumber = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
  const totalPrice = priceNumber * quantity;

  return (
    <>
      <div className="flex items-center mb-2">
        <p className="text-stitch-blue font-bold">{price}</p>
        <p className="text-gray-400 text-sm line-through ml-2">{originalPrice}</p>
      </div>
      
      <motion.div
        key={totalPrice}
        className="text-right font-bold text-stitch-blue"
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Total: R$ {totalPrice.toFixed(2).replace('.', ',')}
      </motion.div>
    </>
  );
};

export default ProductPrice;
