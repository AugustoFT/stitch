
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface ProductButtonsProps {
  selected: boolean;
  handleSelect: () => void;
  onBuyClick: () => void;
  productId?: number;
  productName?: string;
  price?: number;
}

declare global {
  interface Window {
    fbq: any;
  }
}

const ProductButtons: React.FC<ProductButtonsProps> = ({ 
  selected, 
  handleSelect, 
  onBuyClick,
  productId,
  productName,
  price
}) => {
  const handleBuyClick = () => {
    // Track Add to Cart event with Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [productId || 0],
        content_name: productName || 'Product',
        value: price || 0,
        currency: 'BRL'
      });
    }
    
    onBuyClick();
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        className={`flex-1 py-2 px-3 rounded-md font-medium text-sm ${
          selected 
            ? 'bg-gray-200 text-gray-700'
            : 'bg-stitch-light text-stitch-blue hover:bg-stitch-light/80'
        }`}
        whileTap={{ scale: 0.95 }}
        onClick={handleSelect}
      >
        {selected ? 'Selecionado' : 'Selecionar'}
      </motion.button>
      
      <motion.button
        className="flex-1 bg-stitch-blue text-white py-2 px-3 rounded-md font-medium text-sm hover:bg-stitch-blue/90 flex items-center justify-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleBuyClick}
      >
        <ShoppingBag className="w-4 h-4 mr-1" />
        Comprar
      </motion.button>
    </div>
  );
};

export default ProductButtons;
