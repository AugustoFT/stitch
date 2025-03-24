
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png" 
          alt="Stitch Logo" 
          className="h-12 w-auto animate-float"
        />
        <div className="font-display text-xl text-stitch-blue font-semibold">Lilo e Stitch</div>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.div 
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag className="h-6 w-6 text-stitch-blue" />
          <span className="absolute -top-2 -right-2 bg-stitch-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
        </motion.div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-stitch-blue"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-full left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-md md:shadow-none`}>
        <a href="#mochilas" className="text-foreground hover:text-stitch-blue transition-colors">Pelúcias</a>
        <a href="#beneficios" className="text-foreground hover:text-stitch-blue transition-colors">Benefícios</a>
        <a href="#depoimentos" className="text-foreground hover:text-stitch-blue transition-colors">Depoimentos</a>
        <a href="#faq" className="text-foreground hover:text-stitch-blue transition-colors">FAQ</a>
        <a href="#checkout" className="btn-primary py-2 px-4 md:ml-4">Comprar</a>
      </nav>
    </motion.header>
  );
};

export default Header;
