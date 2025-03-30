
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Star } from 'lucide-react';

interface HeroSectionProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  scrollToCheckout: () => void;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const HeroSection: React.FC<HeroSectionProps> = ({ timeLeft, scrollToCheckout }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  
  const handleComprarClick = () => {
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'comprar_agora',
        buttonLocation: 'hero_section'
      });
    }
    
    scrollToCheckout();
  };

  return (
    <section 
      ref={heroRef}
      className="py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-stitch-pink text-white text-xs font-bold py-1 px-3 rounded-full mb-4 inline-block">
            LANÇAMENTO OFICIAL DISNEY
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-stitch-blue leading-tight mb-4">
            Pelúcias <span className="text-stitch-pink">Stitch</span> Exclusivas
          </h1>
          <p className="text-gray-700 text-base mb-6">
            Adquira sua pelúcia oficial da Disney e leve o carismático Stitch para todas as suas aventuras. Design único, qualidade premium e muita fofura!
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/ab25fdf7-5c56-4558-96da-9754bee039be.png" 
                alt="Pelúcia Stitch" 
                className="w-4/5 max-w-sm mx-auto drop-shadow-xl animate-float"
              />
              <motion.div 
                className="absolute -right-5 top-5 bg-stitch-yellow text-stitch-dark p-2 rounded-full shadow-lg font-bold text-sm transform rotate-12"
                animate={{ rotate: [12, 16, 12] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Edição limitada
              </motion.div>
            </div>
          </motion.div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg mb-6 border border-stitch-blue/20">
            <p className="text-stitch-blue font-bold text-sm mb-2">Oferta por tempo limitado:</p>
            <div className="flex gap-1">
              <div className="bg-stitch-dark text-white px-2 py-1 rounded-md text-center min-w-[50px]">
                <div className="text-lg font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-xs">dias</div>
              </div>
              <div className="bg-stitch-dark text-white px-2 py-1 rounded-md text-center min-w-[50px]">
                <div className="text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs">horas</div>
              </div>
              <div className="bg-stitch-dark text-white px-2 py-1 rounded-md text-center min-w-[50px]">
                <div className="text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs">min</div>
              </div>
              <div className="bg-stitch-dark text-white px-2 py-1 rounded-md text-center min-w-[50px]">
                <div className="text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs">seg</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button 
              className="btn-primary mr-3 text-sm py-2 px-4"
              onClick={handleComprarClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              Comprar Agora
            </motion.button>
            <motion.a 
              href="#beneficios"
              className="inline-block py-2 px-4 text-sm text-stitch-blue border border-stitch-blue/30 rounded-md hover:bg-stitch-blue/10 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              Saiba Mais
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="relative">
            <img 
              src="/lovable-uploads/1c4608df-7348-4fa2-98f9-0c546b5c8895.png" 
              alt="Kit Completo Stitch" 
              className="w-4/5 max-w-sm mx-auto drop-shadow-xl animate-float"
            />
            <motion.button 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-stitch-pink text-white py-2 px-6 rounded-full shadow-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComprarClick}
            >
              Kit Exclusivo Stitch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
