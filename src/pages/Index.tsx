
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CheckoutForm from '../components/CheckoutForm';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  // Create refs and useInView hooks for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  
  const productRef = useRef<HTMLDivElement>(null);
  const productInView = useInView(productRef, { once: true, margin: "-100px" });
  
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsInView = useInView(detailsRef, { once: true, margin: "-100px" });
  
  const featureRef = useRef<HTMLDivElement>(null);
  const featureInView = useInView(featureRef, { once: true, margin: "-100px" });
  
  const testimonialRef = useRef<HTMLDivElement>(null);
  const testimonialInView = useInView(testimonialRef, { once: true, margin: "-100px" });
  
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutInView = useInView(checkoutRef, { once: true, margin: "-100px" });

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div className="star-bg">
        <Header />
        
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-stitch-pink text-white text-sm font-bold py-1 px-4 rounded-full mb-6 inline-block">
                EDIÇÃO LIMITADA
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                Pelúcia <span className="text-stitch-blue">Stitch</span> Interativa
              </h1>
              <p className="text-gray-200 text-lg mb-8">
                Adote seu próprio Stitch e experimente toda a diversão e fofura do querido alienígena azul. Ohana significa família!
              </p>
              <motion.button 
                className="btn-primary mr-4"
                onClick={scrollToCheckout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Comprar Agora
              </motion.button>
              <motion.a 
                href="#detalhes"
                className="inline-block py-3 px-6 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
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
              <img 
                src="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png" 
                alt="Stitch Pelúcia Interativa" 
                className="w-4/5 max-w-md animate-float"
              />
            </motion.div>
          </div>
        </section>
      </div>
      
      {/* Product Section */}
      <section 
        id="produto"
        ref={productRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={productInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Conheça seu novo amigo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A pelúcia interativa do Stitch foi desenhada com detalhes incríveis para replicar fielmente o personagem do filme. Venha conhecer!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            title="Stitch Pelúcia Interativa"
            price="R$ 149,90"
            description="Pelúcia interativa que reproduz sons e frases do Stitch. Tamanho médio (30cm) e super macio."
            imageUrl="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png"
            onBuyClick={scrollToCheckout}
          />
          
          <ProductCard
            title="Stitch Pelúcia Deluxe"
            price="R$ 199,90"
            description="Versão premium com mais funcionalidades: movimenta as orelhas, brilha no escuro e fala mais frases!"
            imageUrl="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png"
            onBuyClick={scrollToCheckout}
          />
          
          <ProductCard
            title="Stitch + Lilo Combo"
            price="R$ 249,90"
            description="Conjunto com Stitch e Lilo, os inseparáveis amigos da ilha. Pelúcias de alta qualidade."
            imageUrl="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png"
            onBuyClick={scrollToCheckout}
          />
        </div>
      </section>
      
      {/* Details Section */}
      <section 
        id="detalhes"
        ref={detailsRef}
        className="py-16 px-6 md:px-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={detailsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Por que você vai amar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa pelúcia do Stitch foi criada com o maior cuidado para trazer toda a magia do filme para sua casa.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={detailsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/be4eeb13-1ca3-4176-ac10-9c6064fedf07.png" 
                  alt="Detalhes da Pelúcia" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={detailsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-stitch-blue text-white p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Material Premium</h3>
                    <p className="text-gray-600">Feito com pelúcia super macia e antialérgica, segura para crianças.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-blue text-white p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Interativo</h3>
                    <p className="text-gray-600">Reproduz frases icônicas e sons do Stitch com apenas um toque.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-blue text-white p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Detalhes Perfeitos</h3>
                    <p className="text-gray-600">Cada detalhe foi cuidadosamente projetado para reproduzir o Stitch com fidelidade.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-stitch-blue text-white p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Presente Perfeito</h3>
                    <p className="text-gray-600">O melhor presente para fãs de Lilo & Stitch de todas as idades.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featureRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={featureInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Características</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            O que torna nossa pelúcia do Stitch tão especial? Confira as características:
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={featureInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-stitch-blue/10 text-stitch-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Tamanho Ideal</h3>
            <p className="text-gray-600">
              Com 30cm de altura, é o tamanho perfeito para abraçar e carregar para qualquer lugar.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={featureInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-stitch-pink/10 text-stitch-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01.001-7.072m8.485 12.728a9 9 0 000-12.728M1.878 15.536a9 9 0 010-12.728" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Sons Autênticos</h3>
            <p className="text-gray-600">
              Reproduz até 10 frases e sons originais do filme, como "Hi!" e "Ohana".
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={featureInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-stitch-yellow/10 text-stitch-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Brilha no Escuro</h3>
            <p className="text-gray-600">
              Os olhos e detalhes especiais brilham no escuro, assim como no filme.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section 
        ref={testimonialRef}
        className="py-16 px-6 md:px-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja os depoimentos de quem já adotou um Stitch e está feliz com seu novo amigo.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-stitch-yellow">
                  {'★★★★★'}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Minha filha amou o Stitch! A qualidade é incrível e os sons são igualzinhos aos do filme. Superou todas as minhas expectativas!"
              </p>
              <div className="font-medium">Maria S.</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-stitch-yellow">
                  {'★★★★★'}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Comprei para o meu sobrinho e ele não larga mais! A pelúcia é super macia e os detalhes são incríveis. Vale cada centavo!"
              </p>
              <div className="font-medium">João P.</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-stitch-yellow">
                  {'★★★★★'}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Sou fã de Lilo & Stitch desde criança e essa pelúcia é perfeita! Os sons são idênticos e a qualidade do material é excelente!"
              </p>
              <div className="font-medium">Ana C.</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Checkout Section */}
      <section 
        id="checkout"
        ref={checkoutRef}
        className="py-16 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={checkoutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Garanta seu Stitch Agora</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nosso estoque é limitado! Preencha o formulário abaixo para garantir o seu e receba em casa com frete grátis.
          </p>
        </motion.div>
        
        <CheckoutForm />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
