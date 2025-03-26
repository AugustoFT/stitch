
import React, { useRef, useEffect, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';

// Lazy loading the checkout form component
const CheckoutForm = lazy(() => import('../CheckoutForm'));

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

interface CheckoutSectionProps {
  productsWithQuantity: ProductInfo[];
  totalAmount: number;
  onRemoveProduct?: (productId: number) => void;
  onQuantityChange?: (productId: number, quantity: number) => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ 
  productsWithQuantity, 
  totalAmount,
  onRemoveProduct,
  onQuantityChange
}) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutInView = useInView(checkoutRef, { once: true, margin: "-100px" });

  // Preload the CheckoutForm component when the section is about to be in view
  useEffect(() => {
    if (checkoutInView) {
      import('../CheckoutForm');
    }
  }, [checkoutInView]);

  return (
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
      
      <Suspense fallback={
        <div className="glass-card p-5 rounded-xl max-w-md mx-auto flex items-center justify-center h-96">
          <div className="animate-pulse text-stitch-blue">Carregando formulário...</div>
        </div>
      }>
        <CheckoutForm 
          selectedProducts={productsWithQuantity}
          totalAmount={totalAmount}
          onRemoveProduct={onRemoveProduct}
          onQuantityChange={onQuantityChange}
        />
      </Suspense>
    </section>
  );
};

export default CheckoutSection;
