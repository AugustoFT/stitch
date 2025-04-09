
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const BenefitsSection: React.FC = () => {
  const benefitsRef = useRef<HTMLDivElement>(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="beneficios"
      ref={benefitsRef}
      className="py-10 px-4 md:px-8 bg-gradient-to-b from-white to-stitch-light/50 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Por que você vai amar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Nossos produtos do Stitch combinam fofura, qualidade e o carisma do personagem mais amado da Disney.
            Com pelúcia premium, cores vibrantes, materiais não tóxicos e certificações internacionais.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <OptimizedImage 
                src="lovable-uploads/1c4608df-7348-4fa2-98f9-0c546b5c8895.png" 
                alt="Coleção Stitch" 
                className="w-full h-auto"
                priority={true}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-stitch-blue text-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">Material Premium</h3>
                  <p className="text-gray-600 text-sm">Feita com pelúcia super macia e de alta qualidade que mantém a forma e as cores vibrantes por muito tempo.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-stitch-pink text-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">Design Exclusivo</h3>
                  <p className="text-gray-600 text-sm">Licenciada oficialmente pela Disney, com detalhes fiéis ao personagem Stitch, feita para fãs exigentes.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-stitch-teal text-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">Segurança e Qualidade</h3>
                  <p className="text-gray-600 text-sm">Produto seguro para crianças, com certificações internacionais e produzido com materiais não tóxicos.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-stitch-yellow text-stitch-dark p-2 rounded-full mr-3 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">Versatilidade</h3>
                  <p className="text-gray-600 text-sm">Perfeita para decorar quartos, presentear amigos e familiares ou simplesmente abraçar em momentos de carinho.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
