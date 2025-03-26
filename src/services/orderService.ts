
import { Order } from '../types/orders';

interface LocalOrder {
  id: string;
  date: string;
  customer: string;
  address: string;
  products: string[];
  total: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
}

export const loadOrders = (): LocalOrder[] => {
  try {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    
    if (savedOrders.length === 0) {
      return [];
    }
    
    const formattedOrders: LocalOrder[] = savedOrders.map((order: Order) => {
      // Get items for this order
      const orderItems = savedItems.filter((item: any) => item.order_id === order.id);
      
      // Format the address
      const addressComponents = [
        order.customer_info.address,
        order.customer_info.numero,
        order.customer_info.city,
        order.customer_info.state
      ].filter(Boolean);
      
      return {
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString('pt-BR'),
        customer: order.customer_info.name,
        address: addressComponents.join(', '),
        products: orderItems.map((item: any) => `${item.product_name} (${item.quantity}x)`),
        total: `R$ ${order.total_price.toFixed(2).replace('.', ',')}`,
        status: order.status
      };
    });
    
    return formattedOrders;
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const updateOrderStatus = (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid') => {
  try {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = savedOrders.map((order: Order) => 
      order.id === id ? { ...order, status, updated_at: new Date().toISOString() } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

export const deleteOrder = (id: string) => {
  try {
    // Remove order
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = savedOrders.filter((order: Order) => order.id !== id);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Remove order items
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    const updatedItems = savedItems.filter((item: any) => item.order_id !== id);
    localStorage.setItem('orderItems', JSON.stringify(updatedItems));
    
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
};
