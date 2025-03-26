
import { createNewOrder } from './orderCreator';
import { processPaymentConfirmation } from './paymentProcessor';
import { processOrderShipment } from './shipmentManager';

// Export all functions to maintain backward compatibility
export {
  createNewOrder,
  processPaymentConfirmation,
  processOrderShipment
};
