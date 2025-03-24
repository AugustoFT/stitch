
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FAQSection: React.FC = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="faq"
      ref={faqRef}
      className="py-10 px-4 md:px-8 max-w-7xl mx-auto relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={faqInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Perguntas Frequentes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Tire suas dúvidas sobre nossos produtos e formas de pagamento.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">Os produtos são originais Disney?</h3>
          <p className="text-gray-600 text-sm">Sim, todos os nossos produtos são originais e licenciados oficialmente pela Disney Store, garantindo qualidade e autenticidade.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">Qual o prazo de entrega?</h3>
          <p className="text-gray-600 text-sm">O prazo médio de entrega é de 3 a 7 dias úteis, dependendo da sua localização. Para capitais, costuma chegar em até 3 dias úteis.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">Como faço para limpar a pelúcia?</h3>
          <p className="text-gray-600 text-sm">Recomendamos a limpeza a seco ou com pano levemente umedecido. Não recomendamos máquina de lavar para preservar a pelúcia.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">Quais formas de pagamento são aceitas?</h3>
          <p className="text-gray-600 text-sm">Aceitamos cartões de crédito, boleto bancário, transferência via PIX e PayPal. Parcelamos em até 12x com juros no cartão.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">É possível trocar o produto?</h3>
          <p className="text-gray-600 text-sm">Sim, oferecemos prazo de 7 dias para troca ou devolução caso o produto apresente algum defeito ou não atenda às suas expectativas.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-4 rounded-xl"
        >
          <h3 className="text-lg font-bold text-stitch-blue mb-1">Há outros modelos disponíveis?</h3>
          <p className="text-gray-600 text-sm">Sim, além dos modelos exibidos no site, temos outras opções de personagens Disney. Entre em contato conosco para mais informações.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
