
import { toast } from 'sonner';
import { Order, OrderItem, Shipment } from '../../types/orders';

// Serviço de email simulado
// Em um ambiente real, estas funções enviariam emails reais através de uma API

/**
 * Envia email de confirmação de pedido
 */
export const sendOrderConfirmationEmail = async (order: Order, items: OrderItem[]): Promise<void> => {
  try {
    console.log('Enviando email de confirmação para', order.customer_info.email);
    console.log('Detalhes do pedido:', order);
    console.log('Itens:', items);
    
    // Simular envio de email - Em produção chamaria API
    setTimeout(() => {
      // Simular email enviado
      console.log('Email de confirmação enviado com sucesso');
      toast.success(`Email de confirmação enviado para ${order.customer_info.email}`, {
        duration: 3000,
        id: `order-confirmation-${order.id}`
      });
    }, 1500);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    toast.error('Erro ao enviar email de confirmação');
    return Promise.reject(error);
  }
};

/**
 * Envia email de confirmação de pagamento
 */
export const sendPaymentConfirmedEmail = async (order: Order): Promise<void> => {
  try {
    console.log('Enviando email de confirmação de pagamento para', order.customer_info.email);
    console.log('Detalhes do pagamento:', {
      orderID: order.id,
      paymentID: order.payment_id,
      method: order.payment_method
    });
    
    // Simular envio de email - Em produção chamaria API
    setTimeout(() => {
      // Simular email enviado
      console.log('Email de confirmação de pagamento enviado com sucesso');
      toast.success(`Email de confirmação de pagamento enviado para ${order.customer_info.email}`, {
        duration: 3000,
        id: `payment-confirmation-${order.id}`
      });
    }, 1800);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erro ao enviar email de confirmação de pagamento:', error);
    toast.error('Erro ao enviar email de confirmação de pagamento');
    return Promise.reject(error);
  }
};

/**
 * Envia email com informações de envio
 */
export const sendShipmentEmail = async (order: Order, shipment: Shipment): Promise<void> => {
  try {
    console.log('Enviando email de informações de envio para', order.customer_info.email);
    console.log('Detalhes do envio:', {
      trackingCode: shipment.tracking_code,
      carrier: shipment.carrier,
      estimatedDelivery: shipment.estimated_delivery
    });
    
    // Simular envio de email - Em produção chamaria API
    setTimeout(() => {
      // Simular email enviado
      console.log('Email de informações de envio enviado com sucesso');
      toast.success(`Email com código de rastreio enviado para ${order.customer_info.email}`, {
        duration: 3000,
        id: `shipment-info-${order.id}`
      });
    }, 2000);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erro ao enviar email de informações de envio:', error);
    toast.error('Erro ao enviar email com informações de envio');
    return Promise.reject(error);
  }
};
