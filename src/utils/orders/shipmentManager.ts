
import { v4 as uuidv4 } from 'uuid';
import { Order, Shipment } from '../../types/orders';
import { sendShipmentEmail } from '../notifications/emailService';

/**
 * Processes shipment creation for an order
 */
export const processOrderShipment = async (
  orderId: string,
  carrier: string = 'Correios'
): Promise<Shipment> => {
  try {
    console.log(`Criando envio para pedido ${orderId} via ${carrier}`);
    
    // Generate random tracking code
    const trackingCode = `BR${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    
    // Create shipment object
    const shipment: Shipment = {
      id: uuidv4(),
      order_id: orderId,
      tracking_code: trackingCode,
      carrier: carrier,
      status: 'processing',
      shipped_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 days
    };
    
    // Save shipment
    const savedShipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    savedShipments.push(shipment);
    localStorage.setItem('shipments', JSON.stringify(savedShipments));
    
    console.log('Envio criado com código de rastreio:', trackingCode);
    
    // Update order status to "shipped"
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex((o: Order) => o.id === orderId);
    
    if (orderIndex !== -1) {
      savedOrders[orderIndex].status = 'shipped';
      savedOrders[orderIndex].updated_at = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(savedOrders));
      
      // Send email with shipment information
      try {
        const order = savedOrders[orderIndex];
        await sendShipmentEmail(order, shipment);
        console.log('Email de envio enviado para', order.customer_info.email);
      } catch (emailError) {
        console.error('Erro ao enviar email de envio:', emailError);
      }
    }
    
    return shipment;
  } catch (error) {
    console.error('Erro ao processar envio de pedido:', error);
    throw new Error('Falha ao processar envio');
  }
};
