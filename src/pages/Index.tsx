
import React, { useRef, lazy, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import HeroSection from '../components/sections/HeroSection';

// Lazy loading sections for better performance
const ProductsSection = lazy(() => import('../components/sections/ProductsSection'));
const BenefitsSection = lazy(() => import('../components/sections/BenefitsSection'));
const FeatureCards = lazy(() => import('../components/sections/FeatureCards'));
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'));
const FAQSection = lazy(() => import('../components/sections/FAQSection'));
const CallToAction = lazy(() => import('../components/sections/CallToAction'));
const CheckoutSection = lazy(() => import('../components/sections/CheckoutSection'));

import { useProductSelection } from '../hooks/useProductSelection';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { productsList } from '../data/products';

// Lazy loading component wrapper
const LazyLoadSection = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex justify-center items-center py-20">
      <div className="animate-pulse text-stitch-blue">Carregando...</div>
    </div>
  }>
    {children}
  </Suspense>
);

const Index: React.FC = () => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  
  // Initialize countdown timer
  const timeLeft = useCountdownTimer({
    days: 1,
    hours: 6,
    minutes: 22,
    seconds: 0
  });
  
  // Initialize product selection and cart
  const { 
    selectedProductIds, 
    productsWithQuantity, 
    totalAmount, 
    toggleProductSelection, 
    handleQuantityChange, 
    handleRemoveProduct 
  } = useProductSelection(productsList);

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundElements />
      
      <div className="bg-gradient-to-b from-stitch-blue/20 to-white">
        <Header />
        
        <HeroSection 
          timeLeft={timeLeft} 
          scrollToCheckout={scrollToCheckout} 
        />
      </div>
      
      <LazyLoadSection>
        <ProductsSection 
          products={productsList}
          scrollToCheckout={scrollToCheckout}
          toggleProductSelection={toggleProductSelection}
          handleQuantityChange={handleQuantityChange}
          selectedProductIds={selectedProductIds}
        />
      </LazyLoadSection>
      
      <LazyLoadSection>
        <BenefitsSection />
      </LazyLoadSection>
      
      <LazyLoadSection>
        <FeatureCards />
      </LazyLoadSection>
      
      <LazyLoadSection>
        <TestimonialsSection />
      </LazyLoadSection>
      
      <LazyLoadSection>
        <FAQSection />
      </LazyLoadSection>
      
      <LazyLoadSection>
        <CallToAction scrollToCheckout={scrollToCheckout} />
      </LazyLoadSection>
      
      <div ref={checkoutRef}>
        <LazyLoadSection>
          <CheckoutSection 
            productsWithQuantity={productsWithQuantity}
            totalAmount={totalAmount}
            onRemoveProduct={handleRemoveProduct}
            onQuantityChange={handleQuantityChange}
          />
        </LazyLoadSection>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
