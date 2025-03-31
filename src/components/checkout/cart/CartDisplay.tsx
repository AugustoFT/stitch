
import React, { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import CartProductItem from './CartProductItem';
import CartTotal from './CartTotal';
import EmptyCart from './EmptyCart';
import { ProductInfo } from '../../../hooks/useProductSelection';

interface CartDisplayProps {
  products: ProductInfo[];
  total: number;
  onRemoveProduct: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

// Use memo to prevent unnecessary re-renders
const CartDisplay = memo<CartDisplayProps>(({
  products,
  total,
  onRemoveProduct,
  onQuantityChange
}) => {
  if (products.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-stitch-pink mb-3 text-base flex items-center"
          style={{color: "#ff4c8f"}}>
        <ShoppingBag className="w-4 h-4 mr-2" />
        Carrinho de Compras
      </h3>
      
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {products.map(product => (
            <CartProductItem
              key={product.id}
              product={product}
              onRemoveProduct={onRemoveProduct}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </AnimatePresence>
      </div>
      
      <CartTotal total={total} />
    </div>
  );
});

CartDisplay.displayName = 'CartDisplay';

export default CartDisplay;
