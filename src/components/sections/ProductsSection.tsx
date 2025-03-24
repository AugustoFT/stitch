
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ProductCard from '../ProductCard';

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

interface ProductsSectionProps {
  products: ProductInfo[];
  scrollToCheckout: () => void;
  toggleProductSelection: (productId: number, selected: boolean) => void;
  handleQuantityChange: (productId: number, quantity: number) => void;
  selectedProductIds: number[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  products, 
  scrollToCheckout, 
  toggleProductSelection, 
  handleQuantityChange,
  selectedProductIds
}) => {
  const productRef = useRef<HTMLDivElement>(null);
  const productInView = useInView(productRef, { once: true, margin: "-100px" });

  return (
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
  );
};

export default ProductsSection;
