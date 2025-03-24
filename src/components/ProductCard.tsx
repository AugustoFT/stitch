
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, TruckIcon, BadgePercent } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: string;
  originalPrice: string; // Added original price for strikethrough
  description: string;
  imageUrl: string;
  size?: string;
  discount?: string;
  onBuyClick: () => void;
  additionalInfo?: string; // For small prints like kit contents
  onSelect?: (selected: boolean) => void; // Callback for selection
  isSelected?: boolean; // Is the product selected
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  description,
  imageUrl,
  size,
  discount,
  onBuyClick,
  additionalInfo,
  onSelect,
  isSelected = false
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(e.target.checked);
    }
  };

  return (
    <motion.div 
      className={`glass-card p-5 rounded-2xl mx-auto border-2 ${isSelected ? 'border-stitch-pink' : 'border-stitch-pink/20'} shadow-lg max-w-xs`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      {onSelect && (
        <div className="flex justify-end mb-2">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="form-checkbox h-5 w-5 text-stitch-pink rounded border-gray-300 focus:ring-stitch-pink"
              checked={isSelected}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Selecionar</span>
          </label>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl mb-4 group h-56">
        <motion.img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <div className="bg-stitch-yellow text-stitch-dark font-bold py-1 px-3 rounded-full text-sm shadow-md">
            {price}
          </div>
          {originalPrice && (
            <div className="bg-white/80 text-gray-500 font-medium py-1 px-3 rounded-full text-xs shadow-md line-through">
              {originalPrice}
            </div>
          )}
        </div>
        {discount && (
          <motion.div 
            className="absolute top-3 left-3 bg-stitch-pink text-white font-bold py-2 px-4 rounded-full text-sm shadow-md flex items-center gap-1"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <BadgePercent className="h-4 w-4" />
            {discount}
          </motion.div>
        )}
        {size && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-stitch-dark font-medium py-1 px-3 rounded-full text-xs shadow-sm">
            {size}
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-display font-bold text-stitch-blue mb-2 drop-shadow-sm">{title}</h2>
      
      <p className="text-gray-600 mb-3 text-sm">{description}</p>
      
      {additionalInfo && (
        <p className="text-gray-500 text-xs mb-3 italic">{additionalInfo}</p>
      )}
      
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="h-3 w-3 text-stitch-blue" />
          <span>Oferta por tempo limitado</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Gift className="h-3 w-3 text-stitch-pink" />
          <span>Produto oficial Disney</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TruckIcon className="h-3 w-3 text-stitch-teal" />
          <span>Frete grátis para todo o Brasil</span>
        </div>
      </div>
      
      <motion.button 
        className="btn-primary w-full text-sm py-2"
        onClick={onBuyClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Comprar Agora
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
