
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Palmtree, Flower, Sun } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const TestimonialsSection: React.FC = () => {
  const testRef = useRef<HTMLDivElement>(null);
  const testInView = useInView(testRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="depoimentos"
      ref={testRef}
      className="py-10 px-4 md:px-8 bg-gradient-to-b from-stitch-light/50 to-white relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">O que nossos clientes dizem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Veja os depoimentos de quem já garantiu seus produtos do Stitch e está encantado com a qualidade.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -top-10 -right-10 text-stitch-teal/10">
              <Palmtree size={60} />
            </div>
            <div className="flex items-center mb-3 relative z-10">
              <div className="text-stitch-yellow flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48 flex items-center justify-center">
              <OptimizedImage 
                src="/public/lovable-uploads/8cfc64db-41d0-48e4-b488-c2dfabcbc412.png" 
                alt="Cliente com pelúcia Stitch e rosas"
                className="w-auto h-full object-contain mx-auto"
                priority={true}
              />
            </div>
            <p className="text-gray-600 mb-3 relative z-10 text-sm">
              "Minha filha amou a pelúcia do Stitch! A qualidade é impressionante, super macia e os detalhes são perfeitos. Já estamos de olho nos outros modelos!"
            </p>
            <div className="font-medium relative z-10 text-sm">Camila R.</div>
            <div className="text-xs text-gray-500 relative z-10">São Paulo, SP</div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-10 -right-10 text-stitch-pink/10">
              <Flower size={60} />
            </div>
            <div className="flex items-center mb-3 relative z-10">
              <div className="text-stitch-yellow flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48 flex items-center justify-center">
              <OptimizedImage 
                src="/public/lovable-uploads/2ef0eeb8-09ff-4314-a10e-794186e3aaab.png" 
                alt="Garrafa térmica Stitch"
                className="w-auto h-full object-contain mx-auto"
                priority={true}
              />
            </div>
            <p className="text-gray-600 mb-3 relative z-10 text-sm">
              "A garrafa térmica do Stitch é maravilhosa! O design é único e a qualidade é excepcional. Mantém minha bebida quente por horas e todos perguntam onde comprei!"
            </p>
            <div className="font-medium relative z-10 text-sm">Pedro M.</div>
            <div className="text-xs text-gray-500 relative z-10">Rio de Janeiro, RJ</div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute -top-10 -right-10 text-stitch-blue/10">
              <Sun size={60} />
            </div>
            <div className="flex items-center mb-3 relative z-10">
              <div className="text-stitch-yellow flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48 flex items-center justify-center">
              <OptimizedImage 
                src="/public/lovable-uploads/86397c2f-c5df-4f68-b96a-85761e499eee.png" 
                alt="Criança usando óculos do Stitch"
                className="w-auto h-full object-contain mx-auto"
                priority={true}
              />
            </div>
            <p className="text-gray-600 mb-3 relative z-10 text-sm">
              "Minha filha adora os óculos do Stitch! Ela não tira por nada e fica super fofa com eles. A qualidade é excelente e dura bastante mesmo com o uso diário!"
            </p>
            <div className="font-medium relative z-10 text-sm">Juliana T.</div>
            <div className="text-xs text-gray-500 relative z-10">Curitiba, PR</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
