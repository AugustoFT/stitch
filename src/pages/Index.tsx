
import React, { useRef, useEffect, lazy, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import HeroSection from '../components/sections/HeroSection';
import { useProductSelection } from '../hooks/useProductSelection';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { productsList } from '../data/products';
import { initDataLayer, pushToDataLayer } from '../utils/dataLayer';

// Lazy load non-critical components
const ProductsSection = lazy(() => import('../components/sections/ProductsSection'));
const BenefitsSection = lazy(() => import('../components/sections/BenefitsSection'));
const FeatureCards = lazy(() => import('../components/sections/FeatureCards'));
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'));
const FAQSection = lazy(() => import('../components/sections/FAQSection'));
const CallToAction = lazy(() => import('../components/sections/CallToAction'));
const CheckoutSection = lazy(() => import('../components/sections/CheckoutSection'));

// Fallback components
const SectionSkeleton = () => (
  <div className="py-10 px-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Index: React.FC = () => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  
  // Initialize dataLayer
  useEffect(() => {
    initDataLayer();
    
    // Track page view
    pushToDataLayer('pageView', {
      page_type: 'landing_page',
      page_name: 'Stitch Landing Page',
      page_path: window.location.pathname
    });
  }, []);
  
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
    
    // Track scroll to checkout event
    pushToDataLayer('scrollToCheckout', {
      categoria: 'Navegacao',
      acao: 'Scroll para Checkout'
    });
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
      
      <Suspense fallback={<SectionSkeleton />}>
        <ProductsSection 
          products={productsList}
          scrollToCheckout={scrollToCheckout}
          toggleProductSelection={toggleProductSelection}
          handleQuantityChange={handleQuantityChange}
          selectedProductIds={selectedProductIds}
        />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <BenefitsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <FeatureCards />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <CallToAction scrollToCheckout={scrollToCheckout} />
      </Suspense>
      
      <div ref={checkoutRef}>
        <Suspense fallback={<SectionSkeleton />}>
          <CheckoutSection 
            productsWithQuantity={productsWithQuantity}
            totalAmount={totalAmount}
            onRemoveProduct={handleRemoveProduct}
            onQuantityChange={handleQuantityChange}
          />
        </Suspense>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
