
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ProductQuantitySelector from '../../ProductQuantitySelector';

interface ProductInfo {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartProductItemProps {
  product: ProductInfo;
  onRemoveProduct: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({ 
  product, 
  onRemoveProduct, 
  onQuantityChange 
}) => {
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
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-contain" />
        </div>
        
        <div>
          <p className="text-sm font-medium">{product.title}</p>
          <p className="text-xs text-gray-600">
            R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : product.price}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ProductQuantitySelector 
          quantity={product.quantity} 
          onQuantityChange={(qty) => onQuantityChange(product.id, qty)} 
          maxQuantity={20} // Increase max quantity
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
};

export default CartProductItem;
