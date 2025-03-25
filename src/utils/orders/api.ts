
import { Order, OrderItem, Shipment, Product } from '../../types/orders';
import { v4 as uuidv4 } from 'uuid';
import { isDevelopmentEnvironment } from '../mercadoPago/environment';

// Mockup da API para uso em ambiente de desenvolvimento
// Em produção, estas funções chamariam APIs reais

// Simulação de banco de dados em memória para desenvolvimento
const mockDatabase = {
  orders: [] as Order[],
  orderItems: [] as OrderItem[],
  shipments: [] as Shipment[],
};

// Função para criar um pedido
export const createOrder = async (
  products: { id: number; quantity: number; price: number; name: string; imageUrl?: string }[],
  customerInfo: Order['customer_info'],
  paymentMethod: Order['payment_method'],
  paymentId?: string
): Promise<Order> => {
  try {
    // Calcular o preço total (soma de preço * quantidade de cada item)
    const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    
    // Criar o pedido
    const newOrder: Order = {
      id: uuidv4(),
      user_id: customerInfo.email, // Usando email como user_id para simplificar
      total_price: totalPrice,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_info: customerInfo,
      payment_method: paymentMethod,
      payment_id: paymentId
    };
    
    // Em desenvolvimento, salvamos no mock, em produção enviaríamos para a API
    if (isDevelopmentEnvironment()) {
      mockDatabase.orders.push(newOrder);
      
      // Criar os itens do pedido
      const orderItems = products.map(product => {
        const orderItem: OrderItem = {
          id: uuidv4(),
          order_id: newOrder.id,
          product_id: product.id,
          quantity: product.quantity,
          price: product.price,
          product_name: product.name,
          product_image: product.imageUrl
        };
        mockDatabase.orderItems.push(orderItem);
        return orderItem;
      });
      
      console.log('Pedido criado:', newOrder);
      console.log('Itens do pedido:', orderItems);
      
      return newOrder;
    } else {
      // Aqui você enviaria os dados para sua API real
      // return await apiClient.post('/orders', { order: newOrder, products });
      
      // Mock temporário para produção, substitua por sua implementação real
      return newOrder;
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw new Error('Falha ao criar pedido');
  }
};

// Função para atualizar o status do pedido após pagamento
export const updateOrderAfterPayment = async (
  orderId: string, 
  paymentId: string, 
  status: 'paid' | 'cancelled'
): Promise<Order> => {
  try {
    if (isDevelopmentEnvironment()) {
      // Encontrar o pedido no mock
      const orderIndex = mockDatabase.orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) throw new Error('Pedido não encontrado');
      
      // Atualizar o pedido
      mockDatabase.orders[orderIndex] = {
        ...mockDatabase.orders[orderIndex],
        status,
        payment_id: paymentId,
        updated_at: new Date().toISOString()
      };
      
      console.log('Pedido atualizado após pagamento:', mockDatabase.orders[orderIndex]);
      return mockDatabase.orders[orderIndex];
    } else {
      // Implementação para produção
      // return await apiClient.put(`/orders/${orderId}/payment`, { paymentId, status });
      
      // Mock temporário para produção
      return {
        id: orderId,
        user_id: '',
        total_price: 0,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_info: { name: '', email: '', cpf: '' },
        payment_method: 'credit_card',
        payment_id: paymentId
      };
    }
  } catch (error) {
    console.error('Erro ao atualizar pedido após pagamento:', error);
    throw new Error('Falha ao atualizar status do pedido');
  }
};

// Função para criar um envio com código de rastreio
export const createShipment = async (orderId: string, carrier: string): Promise<Shipment> => {
  try {
    // Gerar um código de rastreio aleatório
    const trackingCode = `TR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    const newShipment: Shipment = {
      id: uuidv4(),
      order_id: orderId,
      tracking_code: trackingCode,
      carrier,
      status: 'processing',
      shipped_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Estimativa de 7 dias
    };
    
    if (isDevelopmentEnvironment()) {
      // Salvar o envio no mock
      mockDatabase.shipments.push(newShipment);
      
      // Atualizar o pedido para "shipped"
      const orderIndex = mockDatabase.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockDatabase.orders[orderIndex] = {
          ...mockDatabase.orders[orderIndex],
          status: 'shipped',
          updated_at: new Date().toISOString()
        };
      }
      
      console.log('Envio criado:', newShipment);
      return newShipment;
    } else {
      // Implementação para produção
      // return await apiClient.post('/shipments', newShipment);
      
      // Mock temporário
      return newShipment;
    }
  } catch (error) {
    console.error('Erro ao criar envio:', error);
    throw new Error('Falha ao criar envio');
  }
};

// Função para obter todos os pedidos
export const getOrders = async (): Promise<Order[]> => {
  try {
    if (isDevelopmentEnvironment()) {
      return mockDatabase.orders;
    } else {
      // return await apiClient.get('/orders');
      return [];
    }
  } catch (error) {
    console.error('Erro ao obter pedidos:', error);
    return [];
  }
};

// Função para obter um pedido específico com seus itens
export const getOrderWithItems = async (orderId: string): Promise<{ order: Order, items: OrderItem[] }> => {
  try {
    if (isDevelopmentEnvironment()) {
      const order = mockDatabase.orders.find(o => o.id === orderId);
      if (!order) throw new Error('Pedido não encontrado');
      
      const items = mockDatabase.orderItems.filter(item => item.order_id === orderId);
      
      return { order, items };
    } else {
      // return await apiClient.get(`/orders/${orderId}/with-items`);
      return { order: {} as Order, items: [] };
    }
  } catch (error) {
    console.error('Erro ao obter pedido com itens:', error);
    throw new Error('Falha ao obter detalhes do pedido');
  }
};

// Função para obter o envio de um pedido
export const getOrderShipment = async (orderId: string): Promise<Shipment | null> => {
  try {
    if (isDevelopmentEnvironment()) {
      return mockDatabase.shipments.find(s => s.order_id === orderId) || null;
    } else {
      // return await apiClient.get(`/orders/${orderId}/shipment`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter envio do pedido:', error);
    return null;
  }
};
