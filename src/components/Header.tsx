
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="py-4 px-6 md:px-12 flex justify-between items-center"
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
        <div className="font-display text-xl text-stitch-blue font-semibold">Ohana Shop</div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#produto" className="text-foreground hover:text-stitch-blue transition-colors">Produto</a>
        <a href="#detalhes" className="text-foreground hover:text-stitch-blue transition-colors">Detalhes</a>
        <a href="#checkout" className="text-foreground hover:text-stitch-blue transition-colors">Comprar</a>
      </nav>
    </motion.header>
  );
};

export default Header;
