
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import CheckoutForm from '../CheckoutForm';

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
  
  // Estado local para lidar com alterações de produtos em tempo real
  const [localProducts, setLocalProducts] = useState<ProductInfo[]>(productsWithQuantity);
  const [localTotal, setLocalTotal] = useState<number>(totalAmount);
  
  // Atualizar produtos e total quando props mudarem
  useEffect(() => {
    setLocalProducts(productsWithQuantity);
    setLocalTotal(totalAmount);
  }, [productsWithQuantity, totalAmount]);

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
      
      <CheckoutForm 
        selectedProducts={localProducts}
        totalAmount={localTotal}
        onRemoveProduct={onRemoveProduct}
        onQuantityChange={onQuantityChange}
      />
    </section>
  );
};

export default CheckoutSection;
