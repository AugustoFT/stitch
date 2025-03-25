
import { Order, OrderItem, Shipment } from '../../types/orders';
import { 
  createOrder, 
  updateOrderAfterPayment, 
  createShipment,
  getOrderWithItems
} from './api';
import { 
  sendOrderConfirmationEmail, 
  sendPaymentConfirmedEmail, 
  sendShipmentEmail 
} from '../notifications/emailService';

// Função para criar um novo pedido
export const createNewOrder = async (
  products: { id: number; quantity: number; price: number; name: string; imageUrl?: string }[],
  customerInfo: Order['customer_info'],
  paymentMethod: Order['payment_method'],
  paymentId?: string
): Promise<Order> => {
  try {
    // Criar o pedido
    const order = await createOrder(products, customerInfo, paymentMethod, paymentId);
    
    // Obter os itens do pedido
    const { items } = await getOrderWithItems(order.id);
    
    // Enviar email de confirmação
    await sendOrderConfirmationEmail(order, items);
    
    return order;
  } catch (error) {
    console.error('Erro ao criar novo pedido:', error);
    throw new Error('Falha ao processar pedido');
  }
};

// Função para processar pagamento confirmado
export const processPaymentConfirmation = async (
  orderId: string,
  paymentId: string,
  success: boolean
): Promise<Order> => {
  try {
    // Atualizar o status do pedido
    const status = success ? 'paid' : 'cancelled';
    const updatedOrder = await updateOrderAfterPayment(orderId, paymentId, status);
    
    // Se o pagamento foi bem-sucedido, enviar email de confirmação
    if (success) {
      await sendPaymentConfirmedEmail(updatedOrder);
    }
    
    return updatedOrder;
  } catch (error) {
    console.error('Erro ao processar confirmação de pagamento:', error);
    throw new Error('Falha ao processar confirmação de pagamento');
  }
};

// Função para processar envio de pedido
export const processOrderShipment = async (
  orderId: string,
  carrier: string = 'Correios'
): Promise<Shipment> => {
  try {
    // Criar o envio com código de rastreio
    const shipment = await createShipment(orderId, carrier);
    
    // Obter os detalhes do pedido
    const { order } = await getOrderWithItems(orderId);
    
    // Enviar email com código de rastreio
    await sendShipmentEmail(order, shipment);
    
    return shipment;
  } catch (error) {
    console.error('Erro ao processar envio de pedido:', error);
    throw new Error('Falha ao processar envio');
  }
};
