
import { Order, OrderItem, Shipment } from '../../types/orders';
import { isDevelopmentEnvironment } from '../mercadoPago/environment';

// Interface para templates de email
interface EmailTemplate {
  subject: string;
  body: string;
}

// Função para enviar email (mockada)
export const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  try {
    // Em ambiente de desenvolvimento, apenas simulamos o envio
    if (isDevelopmentEnvironment()) {
      console.log('==== EMAIL SIMULADO ====');
      console.log(`Para: ${to}`);
      console.log(`Assunto: ${subject}`);
      console.log(`Conteúdo: ${body}`);
      console.log('=======================');
      return true;
    } else {
      // Implementação real usando algum serviço de email como SendGrid, Mailgun, etc.
      // Exemplo:
      // const response = await emailClient.send({ to, subject, html: body });
      // return response.status === 'success';
      
      // Mock para produção
      console.log('Email enviado em produção para:', to);
      return true;
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

// Template para email de confirmação de pedido
const getOrderConfirmationTemplate = (order: Order, items: OrderItem[]): EmailTemplate => {
  const itemsList = items.map(item => 
    `- ${item.quantity}x ${item.product_name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');
  
  return {
    subject: `Confirmação de Pedido #${order.id.slice(0, 8)}`,
    body: `
      Olá ${order.customer_info.name},
      
      Seu pedido foi realizado com sucesso!
      
      DETALHES DO PEDIDO:
      Número do pedido: #${order.id.slice(0, 8)}
      Data: ${new Date(order.created_at).toLocaleDateString('pt-BR')}
      
      ITENS:
      ${itemsList}
      
      TOTAL: R$ ${order.total_price.toFixed(2).replace('.', ',')}
      
      STATUS: ${order.status === 'pending' ? 'Aguardando pagamento' : 'Pago'}
      
      Você receberá atualizações sobre o status do seu pedido.
      
      Obrigado pela sua compra!
      Equipe Stitch Brasil
    `
  };
};

// Template para email de pagamento confirmado
const getPaymentConfirmedTemplate = (order: Order): EmailTemplate => {
  return {
    subject: `Pagamento Confirmado - Pedido #${order.id.slice(0, 8)}`,
    body: `
      Olá ${order.customer_info.name},
      
      O pagamento do seu pedido #${order.id.slice(0, 8)} foi confirmado com sucesso!
      
      Estamos preparando seus produtos para envio.
      Você receberá uma notificação com o código de rastreio assim que o pedido for despachado.
      
      Forma de pagamento: ${order.payment_method === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}
      Valor total: R$ ${order.total_price.toFixed(2).replace('.', ',')}
      
      Obrigado pela sua confiança!
      Equipe Stitch Brasil
    `
  };
};

// Template para email de envio
const getShipmentTemplate = (order: Order, shipment: Shipment): EmailTemplate => {
  return {
    subject: `Pedido Enviado #${order.id.slice(0, 8)} - Código de Rastreio`,
    body: `
      Olá ${order.customer_info.name},
      
      Seu pedido #${order.id.slice(0, 8)} foi enviado com sucesso!
      
      DETALHES DO ENVIO:
      Código de rastreio: ${shipment.tracking_code}
      Transportadora: ${shipment.carrier}
      Data de envio: ${new Date(shipment.shipped_at!).toLocaleDateString('pt-BR')}
      Entrega estimada: ${new Date(shipment.estimated_delivery!).toLocaleDateString('pt-BR')}
      
      Para acompanhar seu pedido, utilize o código de rastreio acima no site da transportadora.
      
      Obrigado pela sua compra!
      Equipe Stitch Brasil
    `
  };
};

// Função para enviar email de confirmação de pedido
export const sendOrderConfirmationEmail = async (
  order: Order, 
  items: OrderItem[]
): Promise<boolean> => {
  const template = getOrderConfirmationTemplate(order, items);
  return await sendEmail(order.customer_info.email, template.subject, template.body);
};

// Função para enviar email de pagamento confirmado
export const sendPaymentConfirmedEmail = async (order: Order): Promise<boolean> => {
  const template = getPaymentConfirmedTemplate(order);
  return await sendEmail(order.customer_info.email, template.subject, template.body);
};

// Função para enviar email de envio com código de rastreio
export const sendShipmentEmail = async (
  order: Order, 
  shipment: Shipment
): Promise<boolean> => {
  const template = getShipmentTemplate(order, shipment);
  return await sendEmail(order.customer_info.email, template.subject, template.body);
};
