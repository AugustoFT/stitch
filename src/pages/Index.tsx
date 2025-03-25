
import React, { useRef, useState, useEffect } from 'react';
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
  const checkoutRef = useRef<HTMLDivElement>(null);
  
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
  
  // Efeito para atualizar os produtos selecionados e recalcular o total quando a seleção muda
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
  }, [selectedProductIds]);

  // Efeito para atualizar o total quando a quantidade muda
  useEffect(() => {
    if (productsWithQuantity.length > 0) {
      const total = productsWithQuantity.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        return sum + (price * product.quantity);
      }, 0);
      
      setTotalAmount(total);
    }
  }, [productsWithQuantity]);

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
    setProductsWithQuantity(prev => {
      return prev.map(product => 
        product.id === productId ? { ...product, quantity } : product
      );
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
      
      <ProductsSection 
        products={products}
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
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
