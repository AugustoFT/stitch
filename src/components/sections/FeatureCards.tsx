
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Gift, TruckIcon, Clock, Flower, Palmtree, Sun } from 'lucide-react';

const FeatureCards: React.FC = () => {
  return (
    <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="glass-card p-4 rounded-xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-2 right-2 text-stitch-teal/20">
            <Flower size={20} />
          </div>
          <div className="w-12 h-12 bg-stitch-blue/10 text-stitch-blue rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium mb-1">Produto Original</h3>
          <p className="text-gray-600 text-xs">
            Produtos licenciados oficialmente pela Disney Store.
          </p>
        </motion.div>
        
        <motion.div 
          className="glass-card p-4 rounded-xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-2 right-2 text-stitch-pink/20">
            <Palmtree size={20} />
          </div>
          <div className="w-12 h-12 bg-stitch-pink/10 text-stitch-pink rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium mb-1">Edição Especial</h3>
          <p className="text-gray-600 text-xs">
            Modelos exclusivos inspirados no Havaí.
          </p>
        </motion.div>
        
        <motion.div 
          className="glass-card p-4 rounded-xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-2 right-2 text-stitch-yellow/20">
            <Sun size={20} />
          </div>
          <div className="w-12 h-12 bg-stitch-teal/10 text-stitch-teal rounded-full flex items-center justify-center mx-auto mb-3">
            <TruckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium mb-1">Frete Grátis</h3>
          <p className="text-gray-600 text-xs">
            Entrega para todo o Brasil sem custo adicional.
          </p>
        </motion.div>
        
        <motion.div 
          className="glass-card p-4 rounded-xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-2 right-2 text-stitch-blue/20">
            <Flower size={20} strokeWidth={1} />
          </div>
          <div className="w-12 h-12 bg-stitch-yellow/10 text-stitch-yellow rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium mb-1">Entrega Rápida</h3>
          <p className="text-gray-600 text-xs">
            Envio em até 24h após confirmação.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;
