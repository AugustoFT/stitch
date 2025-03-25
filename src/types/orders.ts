
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  customer_info: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    cpf: string;
  };
  payment_method: 'credit_card' | 'pix';
  payment_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  tracking_code: string;
  carrier: string;
  status: 'processing' | 'in_transit' | 'delivered';
  shipped_at?: string;
  delivered_at?: string;
  estimated_delivery?: string;
}

export type OrderStatus = Order['status'];
export type ShipmentStatus = Shipment['status'];
