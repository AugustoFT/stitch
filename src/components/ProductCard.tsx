
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Truck, Award, Users } from 'lucide-react';
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
  const [countdown, setCountdown] = useState(1800); // 30 minutes in seconds
  
  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format countdown to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
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
  
  // Check if the price is over the free shipping threshold
  const hasFreeShipping = priceNumber >= 99.98;
  
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
        
        {title.includes("Kit Completo") && (
          <div className="absolute top-2 left-2 bg-stitch-yellow text-stitch-dark text-xs font-bold py-1 px-2 rounded-full">
            Edição Limitada
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <div className="flex items-center mb-2">
          <p className="text-stitch-blue font-bold">{price}</p>
          <p className="text-gray-400 text-sm line-through ml-2">{originalPrice}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        {/* Free shipping badge */}
        {hasFreeShipping && (
          <div className="bg-green-100 text-green-800 text-xs p-1.5 mb-2 rounded flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            Frete Grátis
          </div>
        )}
        
        {/* Limited time offer countdown */}
        <div className="bg-stitch-light text-stitch-blue text-xs p-1.5 mb-3 rounded flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Oferta termina em: {formatTime(countdown)}
        </div>
        
        {/* Social proof */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {Math.floor(Math.random() * 20) + 8} pessoas compraram
          </span>
          <span className="">{size}</span>
        </div>
        
        {additionalInfo && (
          <span className="text-xs text-stitch-pink block mb-2">{additionalInfo}</span>
        )}
        
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
          
          {/* Guarantee banner */}
          <div className="bg-gray-100 p-2 rounded-md text-center text-xs text-gray-700 flex items-center justify-center">
            <Award className="w-3 h-3 mr-1 text-stitch-blue" />
            Garantia de 30 dias
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
