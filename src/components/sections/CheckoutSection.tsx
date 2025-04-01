
import React, { useRef, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProductInfo } from '../../hooks/useProductSelection';

// Lazy load CheckoutForm component
const CheckoutForm = lazy(() => import('../CheckoutForm'));

// Fallback component for CheckoutForm
const CheckoutFormSkeleton = () => (
  <div className="animate-pulse p-6 rounded-xl bg-white shadow-lg">
    <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
    <div className="h-40 bg-gray-200 rounded mb-6"></div>
    <div className="h-72 bg-gray-200 rounded mb-6"></div>
    <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
  </div>
);

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

  return (
    <section 
      id="checkout"
      ref={checkoutRef}
      className="py-10 px-4 md:px-8 max-w-7xl mx-auto relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={checkoutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Garanta seus Produtos Stitch</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Preencha o formulário abaixo para realizar seu pedido. Estoque limitado!
        </p>
      </motion.div>
      
      <Suspense fallback={<CheckoutFormSkeleton />}>
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
