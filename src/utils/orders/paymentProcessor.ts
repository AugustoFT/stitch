
import { Order } from '../../types/orders';
import { sendPaymentConfirmedEmail } from '../notifications/emailService';
import { processOrderShipment } from './shipmentManager';

/**
 * Processes payment confirmation for an order
 */
export const processPaymentConfirmation = async (
  orderId: string,
  paymentId: string,
  success: boolean
): Promise<Order> => {
  try {
    console.log(`Processando confirmação de pagamento para pedido ${orderId}, paymentId ${paymentId}, sucesso: ${success}`);
    
    // In the development environment, simulate order update
    const status = success ? 'paid' : 'cancelled';
    
    // Get saved orders
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex((o: Order) => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error(`Pedido não encontrado: ${orderId}`);
    }
    
    // Update status and payment_id
    savedOrders[orderIndex].status = status;
    savedOrders[orderIndex].payment_id = paymentId;
    savedOrders[orderIndex].updated_at = new Date().toISOString();
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    
    const updatedOrder = savedOrders[orderIndex];
    
    // If payment was successful, create shipment
    if (success) {
      await processOrderShipment(orderId);
      
      // Send payment confirmation email
      try {
        await sendPaymentConfirmedEmail(updatedOrder);
        console.log('Email de confirmação de pagamento enviado para', updatedOrder.customer_info.email);
      } catch (emailError) {
        console.error('Erro ao enviar email de confirmação de pagamento:', emailError);
      }
    }
    
    return updatedOrder;
  } catch (error) {
    console.error('Erro ao processar confirmação de pagamento:', error);
    throw new Error('Falha ao processar confirmação de pagamento');
  }
};
