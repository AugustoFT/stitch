
import { eventTrackers } from '../../../utils/dataLayer';

interface UseProductInteractionsProps {
  onRemoveProduct?: (productId: number) => void;
  onQuantityChange?: (productId: number, quantity: number) => void;
  productsWithQuantity: any[];
}

export const useProductInteractions = ({ 
  onRemoveProduct, 
  onQuantityChange, 
  productsWithQuantity 
}: UseProductInteractionsProps) => {
  
  // Handle product removal via internal or external handlers
  const handleRemoveProduct = (productId: number) => {
    // Track remove from cart
    if (window.fbq) {
      const product = productsWithQuantity.find(p => p.id === productId);
      if (product) {
        window.fbq('track', 'RemoveFromCart', {
          content_ids: [productId],
          content_name: product.title,
          value: parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')),
          currency: 'BRL'
        });
      }
    }
    
    // Push to dataLayer
    if (window.dataLayer) {
      const product = productsWithQuantity.find(p => p.id === productId);
      if (product) {
        window.dataLayer.push({
          event: 'remover_produto',
          productId,
          productName: product.title,
          productPrice: parseFloat(String(product.price).replace('R$ ', '').replace(',', '.'))
        });
      }
    }
    
    if (onRemoveProduct) {
      onRemoveProduct(productId);
    }
  };

  // Handle quantity change via internal or external handlers
  const handleQuantityChange = (productId: number, quantity: number) => {
    const product = productsWithQuantity.find(p => p.id === productId);
    const currentQuantity = product ? product.quantity : 0;
    
    if (quantity > currentQuantity && window.fbq) {
      // Track add to cart if increasing quantity
      window.fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: product ? product.title : 'Product',
        value: product ? parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')) : 0,
        currency: 'BRL',
        contents: [
          {
            id: productId,
            quantity: quantity - currentQuantity
          }
        ]
      });
    }
    
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: quantity > currentQuantity ? 'aumentar_quantidade' : 'diminuir_quantidade',
        productId,
        productName: product ? product.title : 'Product',
        productPrice: product ? parseFloat(String(product.price).replace('R$ ', '').replace(',', '.')) : 0,
        oldQuantity: currentQuantity,
        newQuantity: quantity,
        quantityDelta: quantity - currentQuantity
      });
    }
    
    if (onQuantityChange) {
      onQuantityChange(productId, quantity);
    }
  };

  return {
    handleRemoveProduct,
    handleQuantityChange
  };
};
