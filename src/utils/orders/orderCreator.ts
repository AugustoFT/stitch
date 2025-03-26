
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem } from '../../types/orders';
import { sendOrderConfirmationEmail } from '../notifications/emailService';
import { processOrderShipment } from './shipmentManager';

/**
 * Creates a new order with the provided products and customer information
 */
export const createNewOrder = async (
  products: { id: number; name: string; quantity: number; price: number; imageUrl?: string }[],
  customerInfo: Order['customer_info'],
  paymentMethod: Order['payment_method'],
  paymentId?: string
): Promise<Order> => {
  try {
    console.log('Criando novo pedido com produtos:', products);
    console.log('Informações do cliente:', customerInfo);
    console.log('Método de pagamento:', paymentMethod);
    
    // Calculate total price
    const totalPrice = products.reduce((total, product) => {
      // Garantir que o preço seja um número
      const productPrice = typeof product.price === 'number' 
        ? product.price 
        : parseFloat(String(product.price).replace('R$ ', '').replace(',', '.'));
      
      return total + (productPrice * product.quantity);
    }, 0);
    
    // In development environment, simulate an API
    // But implement complete logic to allow testing
    const orderId = uuidv4();
    const now = new Date().toISOString();
    
    // Create order object
    const order: Order = {
      id: orderId,
      user_id: customerInfo.email, // Use email as user identifier
      total_price: totalPrice,
      status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      created_at: now,
      updated_at: now,
      customer_info: customerInfo,
      payment_method: paymentMethod,
      payment_id: paymentId
    };
    
    // Create order items
    const items: OrderItem[] = products.map(product => {
      // Garantir que o preço seja um número
      const productPrice = typeof product.price === 'number' 
        ? product.price 
        : parseFloat(String(product.price).replace('R$ ', '').replace(',', '.'));
        
      return {
        id: uuidv4(),
        order_id: orderId,
        product_id: product.id,
        quantity: product.quantity,
        price: productPrice,
        product_name: product.name,
        product_image: product.imageUrl
      };
    });
    
    // Save order data (simulated in development environment)
    console.log('Pedido criado:', order);
    console.log('Itens do pedido:', items);
    
    // Save to localStorage for session persistence
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    savedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    savedItems.push(...items);
    localStorage.setItem('orderItems', JSON.stringify(savedItems));
    
    // If payment is already confirmed (credit card), create shipment
    if (paymentMethod === 'credit_card') {
      await processOrderShipment(orderId);
    }
    
    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order, items);
      console.log('Email de confirmação enviado para', customerInfo.email);
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError);
    }
    
    return order;
  } catch (error) {
    console.error('Erro ao criar novo pedido:', error);
    throw new Error('Falha ao processar pedido');
  }
};
