
import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon } from 'lucide-react';
import ProductQuantitySelector from './ProductQuantitySelector';
import ProductPrice from './product/ProductPrice';
import ProductBadges from './product/ProductBadges';
import ProductButtons from './product/ProductButtons';
import MobileOptimizedImage from './MobileOptimizedImage';
import { useIsMobile } from '../hooks/use-mobile';
import { useProgressiveLoading } from '../hooks/useProgressiveLoading';

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

const ProductCard: React.FC<ProductCardProps> = memo(({
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
  const isMobile = useIsMobile();
  
  // Usar delays escalonados com base na posição do produto na tela
  const shouldRenderDetails = useProgressiveLoading(isMobile ? 300 : 100);
  
  // Memo para evitar cálculos repetidos
  const priceNumber = useMemo(() => {
    return typeof price === 'number' 
      ? price 
      : parseFloat(String(price).replace('R$ ', '').replace(',', '.'));
  }, [price]);
  
  // Memo para evitar cálculos repetidos
  const hasFreeShipping = useMemo(() => priceNumber >= 99.98, [priceNumber]);
  
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
  
  // Animações otimizadas para mobile
  const cardAnimations = useMemo(() => {
    return isMobile ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 }
    } : {
      whileHover: { y: -5 },
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    };
  }, [isMobile]);
  
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        selected ? 'ring-2 ring-stitch-blue' : ''
      }`}
      {...cardAnimations}
      layout={!isMobile}
    >
      <div className="relative">
        <MobileOptimizedImage 
          src={imageUrl} 
          alt={title} 
          width={300}
          height={200}
          mobileSizes={{ width: 200, height: 140 }}
          className="w-full h-40 md:h-48 object-contain p-3 md:p-4"
          priority={false}
        />
        <ProductBadges 
          discount={discount} 
          title={title} 
          hasFreeShipping={hasFreeShipping} 
        />
      </div>
      
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-lg font-medium mb-1">{title}</h3>
        <ProductPrice 
          price={price} 
          originalPrice={originalPrice} 
          quantity={quantity} 
        />
        
        {shouldRenderDetails && (
          <>
            <p className="text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">{description}</p>
            
            {additionalInfo && (
              <span className="text-xs text-stitch-pink block mb-2">{additionalInfo}</span>
            )}
          </>
        )}
        
        <div className="flex flex-col space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs md:text-sm font-medium text-gray-700">Quantidade:</label>
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
