import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Clock, Check, ShoppingBag, Gift, TruckIcon, Palmtree, Sun, Flower, Umbrella, Sailboat, Waves } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CheckoutForm from '../components/CheckoutForm';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  
  const productRef = useRef<HTMLDivElement>(null);
  const productInView = useInView(productRef, { once: true, margin: "-100px" });
  
  const benefitsRef = useRef<HTMLDivElement>(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  
  const testRef = useRef<HTMLDivElement>(null);
  const testInView = useInView(testRef, { once: true, margin: "-100px" });
  
  const faqRef = useRef<HTMLDivElement>(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutInView = useInView(checkoutRef, { once: true, margin: "-100px" });

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        
        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1;
          
          if (newMinutes < 0) {
            const newHours = prev.hours - 1;
            
            if (newHours < 0) {
              const newDays = prev.days - 1;
              return {
                days: Math.max(0, newDays),
                hours: newDays < 0 ? 0 : 23,
                minutes: newDays < 0 && newHours < 0 ? 0 : 59,
                seconds: newDays < 0 && newHours < 0 && newMinutes < 0 ? 0 : 59
              };
            }
            
            return {
              ...prev,
              hours: newHours,
              minutes: 59,
              seconds: 59
            };
          }
          
          return {
            ...prev,
            minutes: newMinutes,
            seconds: 59
          };
        }
        
        return {
          ...prev,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const floralVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 0.8, scale: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
        >
          <Palmtree className="absolute top-[10%] left-[5%] text-stitch-teal w-60 h-60" />
          <Palmtree className="absolute top-[15%] right-[8%] text-stitch-teal w-40 h-40" />
          <Sun className="absolute top-[30%] left-[20%] text-stitch-yellow w-32 h-32" />
          <Umbrella className="absolute bottom-[20%] left-[15%] text-stitch-pink w-40 h-40" />
          <Sailboat className="absolute bottom-[25%] right-[10%] text-stitch-blue w-48 h-48" />
          <Waves className="absolute bottom-[5%] left-0 right-0 text-stitch-blue w-full h-24" />
          <Flower className="absolute top-[40%] right-[25%] text-stitch-pink w-24 h-24" />
          <Flower className="absolute bottom-[40%] left-[30%] text-stitch-yellow w-20 h-20" />
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute top-20 left-0 text-stitch-teal/20 transform -rotate-12 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
      >
        <Palmtree size={120} />
      </motion.div>
      
      <motion.div 
        className="absolute top-40 right-0 text-stitch-yellow/20 transform rotate-12 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Sun size={100} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 left-10 text-stitch-pink/20 transform -rotate-6 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Flower size={80} />
      </motion.div>
      
      <div className="bg-gradient-to-b from-stitch-blue/20 to-white">
        <Header />
        
        <section 
          ref={heroRef}
          className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-stitch-pink text-white text-sm font-bold py-1 px-4 rounded-full mb-6 inline-block">
                LANÇAMENTO OFICIAL DISNEY
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-stitch-blue leading-tight mb-6">
                Pelúcias <span className="text-stitch-pink">Stitch</span> Exclusivas
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Adquira sua pelúcia oficial da Disney e leve o carismático Stitch para todas as suas aventuras. Design único, qualidade premium e muita fofura!
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-8 border border-stitch-blue/20">
                <p className="text-stitch-blue font-bold mb-2">Oferta por tempo limitado:</p>
                <div className="flex gap-2">
                  <div className="bg-stitch-dark text-white px-3 py-2 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs">dias</div>
                  </div>
                  <div className="bg-stitch-dark text-white px-3 py-2 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs">horas</div>
                  </div>
                  <div className="bg-stitch-dark text-white px-3 py-2 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs">min</div>
                  </div>
                  <div className="bg-stitch-dark text-white px-3 py-2 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs">seg</div>
                  </div>
                </div>
              </div>
              
              <motion.button 
                className="btn-primary mr-4"
                onClick={scrollToCheckout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Comprar Agora
              </motion.button>
              <motion.a 
                href="#beneficios"
                className="inline-block py-3 px-6 text-stitch-blue border border-stitch-blue/30 rounded-md hover:bg-stitch-blue/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Saiba Mais
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <img 
                  src="/lovable-uploads/ccc2d3fc-dacf-4b85-bf81-37933e9ed300.png" 
                  alt="Coleção Stitch" 
                  className="w-4/5 max-w-md mx-auto drop-shadow-xl animate-float"
                />
                <motion.div 
                  className="absolute -right-10 top-10 bg-stitch-yellow text-stitch-dark p-3 rounded-full shadow-lg font-bold text-lg transform rotate-12"
                  animate={{ rotate: [12, 16, 12] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  30% OFF
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <section 
        id="mochilas"
        ref={productRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={productInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stitch-blue">Nossos Produtos Exclusivos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha seus produtos favoritos do Stitch e leve este amiguinho fofo para todos os lugares. Cada modelo é oficial da Disney e feito com materiais de altíssima qualidade.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProductCard
            title="Pelúcia Stitch"
            price="R$ 139,99"
            discount="30% OFF"
            description="Pelúcia oficial Disney do Stitch em azul super macia. O famoso Experimento 626 com detalhes perfeitos para os fãs."
            imageUrl="/lovable-uploads/ce0fa5c9-d164-4d24-bfcf-88d34c3ab37c.png"
            size="20 cm"
            onBuyClick={scrollToCheckout}
          />
          
          <ProductCard
            title="Óculos Stitch"
            price="R$ 129,99"
            description="Óculos de sol temáticos do Stitch com proteção UV400. Design exclusivo e divertido para todas as idades."
            imageUrl="/lovable-uploads/6f89d2fc-034b-404b-8125-04eff3980aac.png"
            discount="30% OFF"
            size="Infantil"
            onBuyClick={scrollToCheckout}
          />
          
          <ProductCard
            title="Kit Completo Stitch"
            price="R$ 399,98"
            description="Kit completo com pelúcia Stitch, garrafa térmica e óculos de sol. O presente perfeito para os fãs de Lilo & Stitch."
            imageUrl="/lovable-uploads/ccc2d3fc-dacf-4b85-bf81-37933e9ed300.png"
            discount="30% OFF"
            size="Kit Completo"
            onBuyClick={scrollToCheckout}
          />
        </div>
      </section>
      
      <section 
        id="beneficios"
        ref={benefitsRef}
        className="py-16 px-6 md:px-12 bg-gradient-to-b from-white to-stitch-light/50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Por que você vai amar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossos produtos do Stitch combinam fofura, qualidade e o carisma do personagem mais amado da Disney.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/ccc2d3fc-dacf-4b85-bf81-37933e9ed300.png" 
                  alt="Coleção Stitch" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-stitch-blue text-white p-3 rounded-full mr-4">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Material Premium</h3>
                    <p className="text-gray-600">Feita com pelúcia super macia e de alta qualidade que mantém a forma e as cores vibrantes por muito tempo.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-pink text-white p-3 rounded-full mr-4">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Design Exclusivo</h3>
                    <p className="text-gray-600">Licenciada oficialmente pela Disney, com detalhes fiéis ao personagem Stitch, feita para fãs exigentes.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-teal text-white p-3 rounded-full mr-4">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Segurança e Qualidade</h3>
                    <p className="text-gray-600">Produto seguro para crianças, com certificações internacionais e produzido com materiais não tóxicos.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-yellow text-stitch-dark p-3 rounded-full mr-4">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Versatilidade</h3>
                    <p className="text-gray-600">Perfeita para decorar quartos, presentear amigos e familiares ou simplesmente abraçar em momentos de carinho.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div 
            className="glass-card p-6 rounded-xl text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-2 right-2 text-stitch-teal/20">
              <Flower size={24} />
            </div>
            <div className="w-16 h-16 bg-stitch-blue/10 text-stitch-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Produto Original</h3>
            <p className="text-gray-600">
              Produtos licenciados oficialmente pela Disney Store, garantindo autenticidade.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-2 right-2 text-stitch-pink/20">
              <Palmtree size={24} />
            </div>
            <div className="w-16 h-16 bg-stitch-pink/10 text-stitch-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Edição Especial</h3>
            <p className="text-gray-600">
              Modelos exclusivos inspirados no clima tropical do Havaí.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-2 right-2 text-stitch-yellow/20">
              <Sun size={24} />
            </div>
            <div className="w-16 h-16 bg-stitch-teal/10 text-stitch-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <TruckIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Frete Grátis</h3>
            <p className="text-gray-600">
              Entregamos para todo o Brasil sem custo adicional nas compras acima de R$99.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-2 right-2 text-stitch-blue/20">
              <Flower size={24} strokeWidth={1} />
            </div>
            <div className="w-16 h-16 bg-stitch-yellow/10 text-stitch-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Entrega Rápida</h3>
            <p className="text-gray-600">
              Envio em até 24h após a confirmação do pagamento.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section 
        id="depoimentos"
        ref={testRef}
        className="py-16 px-6 md:px-12 bg-gradient-to-b from-stitch-light/50 to-white relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja os depoimentos de quem já garantiu seus produtos do Stitch e está encantado com a qualidade.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={testInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute -top-10 -right-10 text-stitch-teal/10">
                <Palmtree size={80} />
              </div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="text-stitch-yellow flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Minha filha amou a pelúcia do Stitch! A qualidade é impressionante, super macia e os detalhes são perfeitos. Já estamos de olho nos outros modelos!"
              </p>
              <div className="font-medium relative z-10">Camila R.</div>
              <div className="text-sm text-gray-500 relative z-10">São Paulo, SP</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={testInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute -top-10 -right-10 text-stitch-pink/10">
                <Flower size={80} />
              </div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="text-stitch-yellow flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Comprei os óculos do Stitch para meu sobrinho e ele não larga mais! Além de lindos, são super resistentes. A entrega foi rápida e o atendimento excelente!"
              </p>
              <div className="font-medium relative z-10">Pedro M.</div>
              <div className="text-sm text-gray-500 relative z-10">Rio de Janeiro, RJ</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={testInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute -top-10 -right-10 text-stitch-blue/10">
                <Sun size={80} />
              </div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="text-stitch-yellow flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Sou fã de Lilo & Stitch e a garrafa térmica superou minhas expectativas! O material é de ótima qualidade e chama atenção por onde passo. Recomendo demais!"
              </p>
              <div className="font-medium relative z-10">Juliana T.</div>
              <div className="text-sm text-gray-500 relative z-10">Curitiba, PR</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section 
        id="faq"
        ref={faqRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos produtos e formas de pagamento.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">Os produtos são originais Disney?</h3>
            <p className="text-gray-600">Sim, todos os nossos produtos são originais e licenciados oficialmente pela Disney Store, garantindo qualidade e autenticidade.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">Qual o prazo de entrega?</h3>
            <p className="text-gray-600">O prazo médio de entrega é de 3 a 7 dias úteis, dependendo da sua localização. Para capitais, costuma chegar em até 3 dias úteis.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">Como faço para limpar a pelúcia?</h3>
            <p className="text-gray-600">Recomendamos a limpeza a seco ou com pano levemente umedecido. Não recomendamos máquina de lavar para preservar a pelúcia e os detalhes.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">Quais formas de pagamento são aceitas?</h3>
            <p className="text-gray-600">Aceitamos cartões de crédito, boleto bancário, transferência via PIX e PayPal. Parcelamos em até 12x com juros no cartão.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">É possível trocar o produto?</h3>
            <p className="text-gray-600">Sim, oferecemos prazo de 7 dias para troca ou devolução caso o produto apresente algum defeito ou não atenda às suas expectativas.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold text-stitch-blue mb-2">Há outros modelos disponíveis?</h3>
            <p className="text-gray-600">Sim, além dos modelos exibidos no site, temos outras opções de personagens Disney. Entre em contato conosco para mais informações.</p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 px-6 md:px-12 bg-gradient-to-r from-stitch-blue to-stitch-darkblue text-white relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Não perca esta oferta exclusiva!
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Adquira seus produtos oficiais do Stitch hoje mesmo e leve um pedacinho do Havaí para sua casa.
            <span className="block mt-2 text-stitch-yellow font-bold">Frete grátis para todo o Brasil!</span>
          </motion.p>
          <motion.button 
            className="bg-stitch-pink hover:bg-stitch-pink/90 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transition-all duration-300"
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
      
      <section 
        id="checkout"
        ref={checkoutRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={checkoutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Garanta seus Produtos Stitch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário abaixo para realizar seu pedido. Estoque limitado!
          </p>
        </motion.div>
        
        <CheckoutForm />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
