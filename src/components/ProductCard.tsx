
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon } from 'lucide-react';
import ProductQuantitySelector from './ProductQuantitySelector';
import ProductPrice from './product/ProductPrice';
import ProductBadges from './product/ProductBadges';
import ProductButtons from './product/ProductButtons';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  title: string;
  price: string | number;
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
    
    // When selected, already propagate the current quantity
    if (newSelected && onQuantityChange) {
      onQuantityChange(quantity);
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    
    // If the product is selected, propagate the quantity change
    if (selected && onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };
  
  // Check if the price is over the free shipping threshold or if it's the Kit Completo
  const priceStr = typeof price === 'string' ? price : String(price);
  const priceNumber = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
  const isKitCompleto = title.includes("Kit Completo");
  const hasFreeShipping = priceNumber >= 99.98 || isKitCompleto;
  
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
        <OptimizedImage 
          src={imageUrl} 
          alt={title} 
          width={300}
          height={200}
          className="w-full h-48 object-contain p-4"
          priority={true}
        />
        <ProductBadges 
          discount={discount} 
          title={title} 
          hasFreeShipping={hasFreeShipping} 
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <ProductPrice 
          price={price} 
          originalPrice={originalPrice} 
          quantity={quantity} 
        />
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        {additionalInfo && (
          <span className="text-xs text-stitch-pink block mb-2">{additionalInfo}</span>
        )}
        
        {hasFreeShipping && (
          <div className="flex items-center text-green-600 text-xs mb-2 font-medium">
            <TruckIcon className="w-3 h-3 mr-1" />
            Frete Grátis
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Quantidade:</label>
            <ProductQuantitySelector 
              quantity={quantity} 
              onQuantityChange={handleQuantityChange} 
            />
          </div>
          
          <ProductButtons 
            selected={selected} 
            handleSelect={handleSelect} 
            onBuyClick={onBuyClick} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
