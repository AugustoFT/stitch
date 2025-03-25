
import { v4 as uuidv4 } from 'uuid';
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
  products: { id: number; name: string; quantity: number; price: number; imageUrl?: string }[],
  customerInfo: Order['customer_info'],
  paymentMethod: Order['payment_method'],
  paymentId?: string
): Promise<Order> => {
  try {
    console.log('Criando novo pedido com produtos:', products);
    console.log('Informações do cliente:', customerInfo);
    console.log('Método de pagamento:', paymentMethod);
    
    // Calcular o valor total do pedido
    const totalPrice = products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    
    // No ambiente de desenvolvimento, simulamos uma API
    // Mas implementamos a lógica completa para permitir testes
    const orderId = uuidv4();
    const now = new Date().toISOString();
    
    // Criar o objeto do pedido
    const order: Order = {
      id: orderId,
      user_id: customerInfo.email, // Usar email como identificador do usuário
      total_price: totalPrice,
      status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      created_at: now,
      updated_at: now,
      customer_info: customerInfo,
      payment_method: paymentMethod,
      payment_id: paymentId
    };
    
    // Criar os itens do pedido
    const items: OrderItem[] = products.map(product => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: product.id,
      quantity: product.quantity,
      price: product.price,
      product_name: product.name,
      product_image: product.imageUrl
    }));
    
    // Salvar os dados do pedido (simulado em ambiente de desenvolvimento)
    console.log('Pedido criado:', order);
    console.log('Itens do pedido:', items);
    
    // Salvar no localStorage para persistência na sessão
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    savedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    savedItems.push(...items);
    localStorage.setItem('orderItems', JSON.stringify(savedItems));
    
    // Se o pagamento já foi confirmado (cartão de crédito), criar o envio
    if (paymentMethod === 'credit_card') {
      await processOrderShipment(orderId);
    }
    
    // Enviar email de confirmação
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

// Função para processar pagamento confirmado
export const processPaymentConfirmation = async (
  orderId: string,
  paymentId: string,
  success: boolean
): Promise<Order> => {
  try {
    console.log(`Processando confirmação de pagamento para pedido ${orderId}, paymentId ${paymentId}, sucesso: ${success}`);
    
    // No ambiente de desenvolvimento, simulamos a atualização do pedido
    const status = success ? 'paid' : 'cancelled';
    
    // Obter pedidos salvos
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex((o: Order) => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error(`Pedido não encontrado: ${orderId}`);
    }
    
    // Atualizar status e payment_id
    savedOrders[orderIndex].status = status;
    savedOrders[orderIndex].payment_id = paymentId;
    savedOrders[orderIndex].updated_at = new Date().toISOString();
    
    // Salvar pedidos atualizados
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    
    const updatedOrder = savedOrders[orderIndex];
    
    // Se o pagamento foi bem-sucedido, criar o envio
    if (success) {
      await processOrderShipment(orderId);
      
      // Enviar email de confirmação de pagamento
      try {
        const items = JSON.parse(localStorage.getItem('orderItems') || '[]')
          .filter((item: OrderItem) => item.order_id === orderId);
          
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

// Função para processar envio de pedido
export const processOrderShipment = async (
  orderId: string,
  carrier: string = 'Correios'
): Promise<Shipment> => {
  try {
    console.log(`Criando envio para pedido ${orderId} via ${carrier}`);
    
    // Gerar código de rastreio aleatório
    const trackingCode = `BR${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    
    // Criar o objeto de envio
    const shipment: Shipment = {
      id: uuidv4(),
      order_id: orderId,
      tracking_code: trackingCode,
      carrier: carrier,
      status: 'processing',
      shipped_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 dias
    };
    
    // Salvar envio
    const savedShipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    savedShipments.push(shipment);
    localStorage.setItem('shipments', JSON.stringify(savedShipments));
    
    console.log('Envio criado com código de rastreio:', trackingCode);
    
    // Atualizar status do pedido para "shipped"
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex((o: Order) => o.id === orderId);
    
    if (orderIndex !== -1) {
      savedOrders[orderIndex].status = 'shipped';
      savedOrders[orderIndex].updated_at = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(savedOrders));
      
      // Enviar email com informações de envio
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
