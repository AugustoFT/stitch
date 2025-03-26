
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import ProductQuantitySelector from './ProductQuantitySelector';

interface ProductCardProps {
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  imageUrl: string;
  size: string;
  discount: string;
  additionalInfo?: string;
  onBuyClick: () => void;
  onSelect: (selected: boolean) => void;
  onQuantityChange?: (quantity: number) => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  description,
  imageUrl,
  size,
  discount,
  additionalInfo,
  onBuyClick,
  onSelect,
  onQuantityChange,
  isSelected
}) => {
  const [selected, setSelected] = useState(isSelected);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);
  
  const handleSelect = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    onSelect(newSelected);
    
    // Quando selecionar, já propaga a quantidade atual
    if (newSelected && onQuantityChange) {
      onQuantityChange(quantity);
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    
    // Se o produto estiver selecionado, propaga a mudança de quantidade
    if (selected && onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };
  
  // Convert price string to number (removing "R$ " and replacing comma with dot)
  // Garantir que o preço seja tratado como string antes de aplicar replace
  const priceStr = typeof price === 'string' ? price : String(price);
  const priceNumber = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
  const totalPrice = priceNumber * quantity;
  
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        selected ? 'ring-2 ring-stitch-blue' : ''
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-contain p-4"
        />
        <div className="absolute top-2 right-2 bg-stitch-pink text-white text-xs font-bold py-1 px-2 rounded-full">
          {discount}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <div className="flex items-center mb-2">
          <p className="text-stitch-blue font-bold">{price}</p>
          <p className="text-gray-400 text-sm line-through ml-2">{originalPrice}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">{size}</span>
          
          {additionalInfo && (
            <span className="text-xs text-stitch-pink">{additionalInfo}</span>
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Quantidade:</label>
            <ProductQuantitySelector 
              quantity={quantity} 
              onQuantityChange={handleQuantityChange} 
            />
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
              onClick={onBuyClick}
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              Comprar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
