
import { useEffect } from 'react';
import { pushToDataLayer } from '../../../utils/dataLayer';

interface UseCheckoutTrackingProps {
  selectedProducts: any[];
  totalAmount: number;
}

export const useCheckoutTracking = ({ selectedProducts, totalAmount }: UseCheckoutTrackingProps) => {
  // Track checkout view when component mounts
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        num_items: selectedProducts.length,
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Push checkout view to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'iniciar_checkout',
        products: selectedProducts.map(p => ({
          id: p.id,
          name: p.title,
          price: p.price,
          quantity: p.quantity
        })),
        total: totalAmount
      });
    }
  }, [selectedProducts, totalAmount]);
};
