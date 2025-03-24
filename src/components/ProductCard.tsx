
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, TruckIcon } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  size?: string;
  discount?: string;
  onBuyClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  description,
  imageUrl,
  size,
  discount,
  onBuyClick
}) => {
  return (
    <motion.div 
      className="glass-card p-6 rounded-2xl max-w-md mx-auto border-2 border-stitch-pink/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden rounded-xl mb-6 group h-72">
        <motion.img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-3 right-3 bg-stitch-yellow text-stitch-dark font-bold py-1 px-3 rounded-full text-sm shadow-md">
          {price}
        </div>
        {discount && (
          <div className="absolute top-3 left-3 bg-stitch-pink text-white font-bold py-1 px-3 rounded-full text-sm shadow-md">
            {discount}
          </div>
        )}
        {size && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-stitch-dark font-medium py-1 px-3 rounded-full text-xs shadow-sm">
            {size}
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-display font-bold text-stitch-blue mb-2 drop-shadow-sm">{title}</h2>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-stitch-blue" />
          <span>Oferta por tempo limitado</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Gift className="h-4 w-4 text-stitch-pink" />
          <span>Produto oficial Disney</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TruckIcon className="h-4 w-4 text-stitch-teal" />
          <span>Frete grátis para todo o Brasil</span>
        </div>
      </div>
      
      <motion.button 
        className="btn-primary w-full"
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
