
import { Order, OrderItem, Shipment } from '../../types/orders';
import { v4 as uuidv4 } from 'uuid';

// Funções de API simuladas para o gerenciamento de pedidos
// Em um ambiente real, estas funções se comunicariam com um backend

/**
 * Cria um novo pedido no sistema
 */
export const createOrder = async (
  products: { id: number; quantity: number; price: number; name: string; imageUrl?: string }[],
  customerInfo: Order['customer_info'],
  paymentMethod: Order['payment_method'],
  paymentId?: string
): Promise<Order> => {
  // Simular chamada de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Calcular valor total
  const totalPrice = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  // Criar objeto do pedido
  const orderId = uuidv4();
  const now = new Date().toISOString();
  
  const order: Order = {
    id: orderId,
    user_id: customerInfo.email,
    total_price: totalPrice,
    status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
    created_at: now,
    updated_at: now,
    customer_info: customerInfo,
    payment_method: paymentMethod,
    payment_id: paymentId
  };
  
  // Criar itens do pedido
  const items: OrderItem[] = products.map(product => ({
    id: uuidv4(),
    order_id: orderId,
    product_id: product.id,
    quantity: product.quantity,
    price: product.price,
    product_name: product.name,
    product_image: product.imageUrl
  }));
  
  // Salvar no localStorage
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  savedOrders.push(order);
  localStorage.setItem('orders', JSON.stringify(savedOrders));
  
  const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  savedItems.push(...items);
  localStorage.setItem('orderItems', JSON.stringify(savedItems));
  
  return order;
};

/**
 * Atualiza o pedido após confirmação de pagamento
 */
export const updateOrderAfterPayment = async (
  orderId: string,
  paymentId: string,
  status: Order['status']
): Promise<Order> => {
  // Simular chamada de API
  await new Promise(resolve => setTimeout(resolve, 600));
  
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
  
  return savedOrders[orderIndex];
};

/**
 * Cria um registro de envio
 */
export const createShipment = async (
  orderId: string,
  carrier: string = 'Correios'
): Promise<Shipment> => {
  // Simular chamada de API
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Gerar código de rastreio aleatório
  const trackingCode = `BR${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
  
  // Criar objeto de envio
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
  
  // Atualizar status do pedido
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = savedOrders.findIndex((o: Order) => o.id === orderId);
  
  if (orderIndex !== -1) {
    savedOrders[orderIndex].status = 'shipped';
    savedOrders[orderIndex].updated_at = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(savedOrders));
  }
  
  return shipment;
};

/**
 * Obtém um pedido com seus itens
 */
export const getOrderWithItems = async (
  orderId: string
): Promise<{ order: Order; items: OrderItem[] }> => {
  // Simular chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obter pedido e itens
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = savedOrders.find((o: Order) => o.id === orderId);
  
  if (!order) {
    throw new Error(`Pedido não encontrado: ${orderId}`);
  }
  
  const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  const items = savedItems.filter((item: OrderItem) => item.order_id === orderId);
  
  return { order, items };
};
