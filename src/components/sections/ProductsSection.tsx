
import React, { useRef, Suspense, lazy } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Clock, Award, Users, TruckIcon } from 'lucide-react';
import { eventTrackers } from '../../utils/dataLayer';
import { ProductInfo } from '../../hooks/useProductSelection';

// Lazy load ProductCard component
const ProductCard = lazy(() => import('../ProductCard'));

// Fallback component while ProductCard is loading
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md h-[400px] animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

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

  const handleProductSelect = (productId: number, selected: boolean) => {
    toggleProductSelection(productId, selected);
    
    // Find the product
    const product = products.find(p => p.id === productId);
    if (product) {
      if (selected) {
        // Track product selected
        eventTrackers.addToCart(product);
      } else {
        // Track product deselected
        eventTrackers.removeFromCart(product);
      }
    }
  };

  const handleProductQuantityChange = (productId: number, quantity: number) => {
    handleQuantityChange(productId, quantity);
    
    // Track quantity change
    const product = products.find(p => p.id === productId);
    if (product) {
      eventTrackers.addToCart({
        ...product,
        quantity
      });
    }
  };
  
  const handleComprarAgora = () => {
    // Track comprar agora click
    eventTrackers.comprarAgora('products_section');
    
    scrollToCheckout();
  };
  
  const handleAproveiteOferta = () => {
    // Track aproveite oferta click
    eventTrackers.comprarAgora('oferta_exclusiva_section');
    
    scrollToCheckout();
  };

  return (
    <section 
      id="produtos"
      ref={productRef}
      className="py-8 px-4 md:px-8 max-w-6xl mx-auto relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={productInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-stitch-blue">Nossos Produtos Exclusivos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Escolha seus produtos favoritos do Stitch e leve este amiguinho fofo para todos os lugares. Cada modelo é oficial da Disney e feito com materiais de altíssima qualidade.
        </p>
        
        <motion.button
          className="mt-5 bg-stitch-pink text-white py-2 px-6 rounded-md shadow-md font-medium flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComprarAgora}
          aria-label="Comprar Agora"
          style={{backgroundColor: "#ff4c8f", color: "#ffffff"}}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Comprar Agora
        </motion.button>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense fallback={<ProductCardSkeleton />}>
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
              onSelect={(selected) => handleProductSelect(product.id, selected)}
              onQuantityChange={(quantity) => handleProductQuantityChange(product.id, quantity)}
              isSelected={selectedProductIds.includes(product.id)}
            />
          ))}
        </Suspense>
      </div>
      
      <div className="mt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={productInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-stitch-light p-4 rounded-lg shadow-sm border border-stitch-blue/30 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="text-stitch-blue h-5 w-5" />
            <h3 className="font-bold text-stitch-blue" style={{color: "#16a4e8"}}>Oferta Exclusiva - Produto Oficial Disney!</h3>
          </div>
          
          <p className="text-gray-700 mb-3">Kit Completo Stitch por apenas <span className="text-stitch-pink font-bold" style={{color: "#ff4c8f"}}>R$ 0,05</span> com frete grátis!</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-3">
            <div className="bg-white px-3 py-1 rounded-full text-xs border border-stitch-blue/20 flex items-center">
              <Clock className="h-3 w-3 mr-1 text-stitch-pink" />
              Oferta por tempo limitado
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-xs border border-stitch-blue/20 flex items-center">
              <Users className="h-3 w-3 mr-1 text-stitch-blue" />
              +500 clientes satisfeitos
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-xs border border-stitch-blue/20 flex items-center">
              <TruckIcon className="h-3 w-3 mr-1 text-green-600" />
              Frete Grátis
            </div>
          </div>
          
          <motion.button
            className="bg-stitch-blue text-white py-2 px-6 rounded-full shadow-md font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAproveiteOferta}
            aria-label="Aproveitar Oferta Exclusiva"
            style={{backgroundColor: "#16a4e8", color: "#ffffff"}}
          >
            Aproveitar Oferta Exclusiva
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
