
import { useEffect } from 'react';
import { pushToDataLayer } from '../../../utils/dataLayer';

interface UseFormTrackingProps {
  selectedProducts: any[];
  totalAmount: number;
}

export const useFormTracking = ({ selectedProducts, totalAmount }: UseFormTrackingProps) => {
  useEffect(() => {
    console.log('FORÇANDO MODO DE PRODUÇÃO!');
    
    // Track ViewContent event when form is shown
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: selectedProducts.map(p => p.id),
        value: totalAmount,
        currency: 'BRL'
      });
    }
    
    // Push to dataLayer
    pushToDataLayer('view_payment_form', {
      payment_method: 'credit_card',
      products: selectedProducts.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        quantity: p.quantity
      })),
      total: totalAmount
    });
  }, [selectedProducts, totalAmount]);
};
