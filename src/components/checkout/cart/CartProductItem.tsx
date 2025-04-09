
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ProductQuantitySelector from '../../ProductQuantitySelector';
import { ProductInfo } from '../../../hooks/useProductSelection';
import OptimizedImage from '../../OptimizedImage';

interface CartProductItemProps {
  product: ProductInfo;
  onRemoveProduct: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

// Use memo to prevent unnecessary re-renders
const CartProductItem = memo<CartProductItemProps>(({ 
  product, 
  onRemoveProduct, 
  onQuantityChange 
}) => {
  const formatPrice = (price: string | number): string => {
    if (typeof price === 'number') {
      return price.toFixed(2).replace('.', ',');
    }
    return price.toString().replace('R$ ', '').replace('.', ',');
  };

  return (
    <motion.div 
      key={product.id} 
      className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 mr-3 bg-white p-1">
          <OptimizedImage 
            src={product.imageUrl} 
            alt={product.title} 
            className="h-full w-full object-contain"
            width={48} 
            height={48}
          />
        </div>
        
        <div>
          <p className="text-sm font-medium">{product.title}</p>
          <p className="text-xs text-gray-600">
            R$ {formatPrice(product.price)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ProductQuantitySelector 
          quantity={product.quantity} 
          onQuantityChange={(qty) => onQuantityChange(product.id, qty)} 
          maxQuantity={20}
        />
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
          onClick={() => onRemoveProduct(product.id)}
          aria-label="Remover produto"
        >
          <X size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
});

CartProductItem.displayName = 'CartProductItem';

export default CartProductItem;
