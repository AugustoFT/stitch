
import { useEffect } from 'react';
import { eventTrackers } from '../../../utils/dataLayer';

interface UsePaymentTrackingProps {
  paymentResult: any;
  totalAmount: number;
  selectedProducts: any[];
}

export const usePaymentTracking = ({ paymentResult, totalAmount, selectedProducts }: UsePaymentTrackingProps) => {
  // Track successful purchases
  useEffect(() => {
    if (paymentResult && paymentResult.status === 'approved') {
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: totalAmount,
          currency: 'BRL',
          content_ids: selectedProducts.map(p => p.id),
          content_type: 'product',
          num_items: selectedProducts.reduce((acc, curr) => acc + curr.quantity, 0)
        });
      }
      
      // Push successful purchase to dataLayer
      eventTrackers.finalizarCompra(
        selectedProducts,
        totalAmount,
        'credit_card',
        paymentResult.id
      );
    }
  }, [paymentResult, totalAmount, selectedProducts]);
};
