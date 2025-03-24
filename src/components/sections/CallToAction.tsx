
import React from 'react';
import { motion } from 'framer-motion';

interface CallToActionProps {
  scrollToCheckout: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ scrollToCheckout }) => {
  return (
    <section className="py-8 px-4 md:px-8 bg-gradient-to-r from-stitch-blue to-stitch-darkblue text-white relative z-10">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2 
          className="text-2xl md:text-3xl font-display font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Não perca esta oferta exclusiva!
        </motion.h2>
        <motion.p 
          className="text-lg mb-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Adquira seus produtos oficiais do Stitch hoje mesmo e leve um pedacinho do Havaí para sua casa.
          <span className="block mt-2 text-stitch-yellow font-bold">Frete grátis para todo o Brasil!</span>
        </motion.p>
        <motion.button 
          className="bg-stitch-pink hover:bg-stitch-pink/90 text-white font-bold text-base py-3 px-6 rounded-full shadow-lg transition-all duration-300"
          onClick={scrollToCheckout}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          COMPRAR AGORA
        </motion.button>
      </div>
    </section>
  );
};

export default CallToAction;
