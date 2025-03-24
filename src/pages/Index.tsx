import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Clock, Check, ShoppingBag, Gift, TruckIcon, Palmtree, Sun, Flower, Umbrella, Sailboat, Waves } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CheckoutForm from '../components/CheckoutForm';
import Footer from '../components/Footer';

interface ProductInfo {
  id: number;
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  imageUrl: string;
  size: string;
  discount: string;
  additionalInfo?: string;
  quantity: number;
}

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

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([0]);
  const [productsWithQuantity, setProductsWithQuantity] = useState<ProductInfo[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const products: ProductInfo[] = [
    {
      id: 0,
      title: "Pelúcia Stitch",
      price: "R$ 0,99",
      originalPrice: "R$ 199,99",
      description: "Pelúcia oficial Disney do Stitch em azul super macia. O famoso Experimento 626 com detalhes perfeitos para os fãs.",
      imageUrl: "/lovable-uploads/ab25fdf7-5c56-4558-96da-9754bee039be.png",
      size: "20 cm",
      discount: "99% OFF",
      quantity: 1
    },
    {
      id: 1,
      title: "Óculos Stitch",
      price: "R$ 129,99",
      originalPrice: "R$ 185,70",
      description: "Óculos de sol temáticos do Stitch com proteção UV400. Design exclusivo e divertido para todas as idades.",
      imageUrl: "/lovable-uploads/6f89d2fc-034b-404b-8125-04eff3980aac.png",
      size: "1 unidade",
      discount: "30% OFF",
      quantity: 1
    },
    {
      id: 2,
      title: "Kit Completo Stitch",
      price: "R$ 399,99",
      originalPrice: "R$ 571,40",
      description: "Kit completo com pelúcia Stitch, garrafa térmica e óculos de sol. O presente perfeito para os fãs de Lilo & Stitch.",
      imageUrl: "/lovable-uploads/1c4608df-7348-4fa2-98f9-0c546b5c8895.png",
      size: "Kit Completo",
      discount: "30% OFF",
      additionalInfo: "Contém 1 pelúcia, 1 óculos e 1 garrafa",
      quantity: 1
    }
  ];
  
  useEffect(() => {
    const selectedProducts = products
      .filter(product => selectedProductIds.includes(product.id))
      .map(product => ({...product}));
    
    setProductsWithQuantity(selectedProducts);
    
    const total = selectedProducts.reduce((sum, product) => {
      const price = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
      return sum + (price * product.quantity);
    }, 0);
    
    setTotalAmount(total);
  }, [selectedProductIds, products]);

  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 6,
    minutes: 22,
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

  const toggleProductSelection = (productId: number, selected: boolean) => {
    if (selected) {
      setSelectedProductIds(prev => [...prev, productId]);
    } else {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    }
  };
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    const updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        quantity
      };
    }
    
    if (selectedProductIds.includes(productId)) {
      const selectedProducts = updatedProducts
        .filter(product => selectedProductIds.includes(product.id));
      
      setProductsWithQuantity(selectedProducts);
      
      const total = selectedProducts.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        return sum + (price * product.quantity);
      }, 0);
      
      setTotalAmount(total);
    }
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
          <Palmtree className="absolute top-[10%] left-[5%] text-stitch-teal w-40 h-40" />
          <Palmtree className="absolute top-[15%] right-[8%] text-stitch-teal w-32 h-32" />
          <Sun className="absolute top-[30%] left-[20%] text-stitch-yellow w-24 h-24" />
          <Umbrella className="absolute bottom-[20%] left-[15%] text-stitch-pink w-32 h-32" />
          <Sailboat className="absolute bottom-[25%] right-[10%] text-stitch-blue w-32 h-32" />
          <Waves className="absolute bottom-[5%] left-0 right-0 text-stitch-blue w-full h-16" />
          <Flower className="absolute top-[40%] right-[25%] text-stitch-pink w-20 h-20" />
          <Flower className="absolute bottom-[40%] left-[30%] text-stitch-yellow w-16 h-16" />
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
                    99% OFF
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
              
              <motion.button 
                className="btn-primary mr-3 text-sm py-2 px-4"
                onClick={scrollToCheckout}
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
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <section 
        id="produtos"
        ref={productRef}
        className="py-8 px-4 md:px-8 max-w-6xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={productInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-stitch-blue">Nossos Produtos Exclusivos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Escolha seus produtos favoritos do Stitch e leve este amiguinho fofo para todos os lugares. Cada modelo é oficial da Disney e feito com materiais de altíssima qualidade.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              description={product.description}
              imageUrl={product.imageUrl}
              size={product.size}
              discount={product.discount}
              additionalInfo={product.additionalInfo}
              onBuyClick={scrollToCheckout}
              onSelect={(selected) => toggleProductSelection(product.id, selected)}
              onQuantityChange={(quantity) => handleQuantityChange(product.id, quantity)}
              isSelected={selectedProductIds.includes(product.id)}
            />
          ))}
        </div>
      </section>
      
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
                <img 
                  src="/lovable-uploads/1c4608df-7348-4fa2-98f9-0c546b5c8895.png" 
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
              <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48">
                <img 
                  src="/lovable-uploads/8cfc64db-41d0-48e4-b488-c2dfabcbc412.png" 
                  alt="Cliente com pelúcia Stitch e rosas"
                  className="w-full h-full object-cover rounded-lg"
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
              <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48">
                <img 
                  src="/lovable-uploads/2ef0eeb8-09ff-4314-a10e-794186e3aaab.png" 
                  alt="Garrafa térmica Stitch"
                  className="w-full h-full object-cover rounded-lg"
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
              <div className="mb-3 relative z-10 rounded-lg overflow-hidden h-48">
                <img 
                  src="/lovable-uploads/86397c2f-c5df-4f68-b96a-85761e499eee.png" 
                  alt="Criança usando óculos do Stitch"
                  className="w-full h-full object-cover rounded-lg"
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
      
      <section 
        id="checkout"
        ref={checkoutRef}
        className="py-10 px-4 md:px-8 max-w-7xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={checkoutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Garanta seus Produtos Stitch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Preencha o formulário abaixo para realizar seu pedido. Estoque limitado!
          </p>
        </motion.div>
        
        <CheckoutForm 
          selectedProducts={productsWithQuantity}
          totalAmount={totalAmount}
        />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

