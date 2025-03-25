
import React, { useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import HeroSection from '../components/sections/HeroSection';
import ProductsSection from '../components/sections/ProductsSection';
import BenefitsSection from '../components/sections/BenefitsSection';
import FeatureCards from '../components/sections/FeatureCards';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import FAQSection from '../components/sections/FAQSection';
import CallToAction from '../components/sections/CallToAction';
import CheckoutSection from '../components/sections/CheckoutSection';
import { useProductSelection } from '../hooks/useProductSelection';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { productsList } from '../data/products';

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
      
      <ProductsSection 
        products={productsList}
        scrollToCheckout={scrollToCheckout}
        toggleProductSelection={toggleProductSelection}
        handleQuantityChange={handleQuantityChange}
        selectedProductIds={selectedProductIds}
      />
      
      <BenefitsSection />
      
      <FeatureCards />
      
      <TestimonialsSection />
      
      <FAQSection />
      
      <CallToAction scrollToCheckout={scrollToCheckout} />
      
      <div ref={checkoutRef}>
        <CheckoutSection 
          productsWithQuantity={productsWithQuantity}
          totalAmount={totalAmount}
          onRemoveProduct={handleRemoveProduct}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
