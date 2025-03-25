
import { client, API_BASE_URL, paymentClient } from './config';

// Interface para dados de pagamento com cartão
export interface CardPaymentRequest {
  token: string;
  paymentMethod: string;
  installments: number;
  transactionAmount: number;
  description: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

// Interface para dados de pagamento com PIX
export interface PixPaymentRequest {
  transactionAmount: number;
  description: string;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

// Interface para resposta de pagamento com PIX
export interface PixPaymentResponse {
  id: string;
  status: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    }
  };
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
}

// URL para as Edge Functions do Supabase
const BACKEND_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || 'https://lilo-stitch-function.supabase.co/functions/v1/process-payment';

/**
 * Função para processar pagamento com cartão via o backend
 * @param paymentData Dados do pagamento com cartão
 * @returns Resposta do processamento do pagamento
 */
export const processCardPaymentRequest = async (paymentData: CardPaymentRequest) => {
  try {
    console.log('Enviando solicitação de pagamento com cartão para o backend:', {
      ...paymentData,
      token: 'XXXX-XXXX-XXXX-XXXX' // Ocultando o token por segurança
    });
    
    // Enviar para nosso backend em vez de diretamente para o MP
    const response = await fetch(`${BACKEND_URL}/card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao processar pagamento');
    }
    
    const responseData = await response.json();
    console.log('Resposta do backend para pagamento com cartão:', responseData);
    
    return {
      id: responseData.id,
      status: responseData.status,
      status_detail: responseData.status_detail,
      message: responseData.message || responseData.status_detail
    };
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    const errorMessage = error.message || 'Erro ao processar pagamento';
    return {
      status: 'rejected',
      status_detail: 'error',
      message: errorMessage
    };
  }
};

/**
 * Função para criar pagamento PIX via o backend
 * @param paymentData Dados do pagamento PIX
 * @returns Resposta com QR code e informações do PIX
 */
export const createPixPaymentRequest = async (paymentData: PixPaymentRequest): Promise<PixPaymentResponse> => {
  try {
    console.log('Enviando solicitação de pagamento PIX para o backend:', paymentData);
    
    // Enviar para nosso backend em vez de diretamente para o MP
    const response = await fetch(`${BACKEND_URL}/pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar pagamento PIX');
    }
    
    const responseData = await response.json();
    console.log('Resposta do backend para pagamento PIX:', responseData);
    
    return {
      id: responseData.id,
      status: responseData.status,
      point_of_interaction: responseData.point_of_interaction,
      qr_code: responseData.qr_code,
      qr_code_base64: responseData.qr_code_base64,
      ticket_url: responseData.ticket_url
    };
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    const errorMessage = error.message || 'Erro ao criar pagamento PIX';
    throw new Error(errorMessage);
  }
};

/**
 * Função para verificar o status de um pagamento via o backend
 * @param paymentId ID do pagamento a ser verificado
 * @returns Status atual do pagamento
 */
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    console.log('Verificando status do pagamento via backend:', paymentId);
    
    const response = await fetch(`${BACKEND_URL}/status?id=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao verificar status do pagamento');
    }
    
    const responseData = await response.json();
    console.log('Resposta do backend para status do pagamento:', responseData);
    
    return {
      id: responseData.id,
      status: responseData.status,
      status_detail: responseData.status_detail
    };
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    const errorMessage = error.message || 'Erro ao verificar status';
    throw new Error(errorMessage);
  }
};

// Função para desenvolvimento (fallback) que será usada quando o servidor estiver indisponível
export const simulateCardPaymentResponse = (paymentData: CardPaymentRequest) => {
  console.log('SIMULAÇÃO: Processando pagamento offline (modo desenvolvimento)');
  
  const testCards: Record<string, any> = {
    '5031433215406351': {
      status: 'approved',
      status_detail: 'accredited',
      message: 'Pagamento aprovado com sucesso!'
    },
    '4000000000000002': {
      status: 'rejected',
      status_detail: 'cc_rejected_insufficient_amount',
      message: 'Pagamento rejeitado. Saldo insuficiente.'
    },
    '4000000000000044': {
      status: 'in_process',
      status_detail: 'pending_contingency',
      message: 'Pagamento em processamento. Aguarde a confirmação.'
    }
  };
  
  // Determinar se estamos em modo de desenvolvimento baseado no hostname
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    // Gerar id aleatório para simulação
    const simulatedId = 'dev_' + Math.random().toString(36).substring(2, 15);
    
    // Retornar resultado simulado
    return {
      id: simulatedId,
      status: 'approved',
      status_detail: 'accredited',
      message: 'Pagamento aprovado com sucesso! (Simulação)'
    };
  }
  
  return {
    status: 'error',
    status_detail: 'backend_unavailable',
    message: 'Não foi possível se conectar ao serviço de pagamento. Por favor, tente novamente mais tarde.'
  };
};

// Função para simular resposta de PIX em desenvolvimento
export const simulatePixPaymentResponse = (paymentData: PixPaymentRequest) => {
  console.log('SIMULAÇÃO: Gerando PIX offline (modo desenvolvimento)');
  
  // QR Code de exemplo em base64
  const sampleQrCodeBase64 = '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';
  
  // Determinar se estamos em modo de desenvolvimento baseado no hostname
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    return {
      id: 'offline_' + Math.random().toString(36).substring(2, 15),
      status: 'pending',
      qr_code: '00020101021226790014br.gov.bcb.pix2557brcode.stitch.com.br/pix/v2/11111111-2222-3333-4444-555555555555520400005303986540510.005802BR5913Pelucia Stitch6008Sao Paulo62070503***63041234',
      qr_code_base64: sampleQrCodeBase64,
      ticket_url: 'https://www.mercadopago.com.br/payments/123456789/ticket',
      point_of_interaction: {
        transaction_data: {
          qr_code: '00020101021226790014br.gov.bcb.pix2557brcode.stitch.com.br/pix/v2/11111111-2222-3333-4444-555555555555520400005303986540510.005802BR5913Pelucia Stitch6008Sao Paulo62070503***63041234',
          qr_code_base64: sampleQrCodeBase64,
          ticket_url: 'https://www.mercadopago.com.br/payments/123456789/ticket',
        }
      }
    };
  }
  
  throw new Error('Não foi possível se conectar ao serviço de pagamento.');
};
