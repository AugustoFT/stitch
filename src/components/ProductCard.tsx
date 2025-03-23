
import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  onBuyClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  description,
  imageUrl,
  onBuyClick
}) => {
  return (
    <motion.div 
      className="glass-card p-6 rounded-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-lg mb-6 group">
        <motion.img 
          src={imageUrl} 
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-3 right-3 bg-stitch-yellow text-stitch-dark font-bold py-1 px-3 rounded-full text-sm">
          {price}
        </div>
      </div>
      
      <h2 className="text-2xl font-display font-bold text-stitch-blue mb-2">{title}</h2>
      
      <p className="text-gray-600 mb-6">{description}</p>
      
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
