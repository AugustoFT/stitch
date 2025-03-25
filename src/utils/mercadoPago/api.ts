
import { API_BASE_URL } from './config';

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

/**
 * Função para processar pagamento com cartão no backend
 * @param paymentData Dados do pagamento com cartão
 * @returns Resposta do processamento do pagamento
 */
export const processCardPaymentRequest = async (paymentData: CardPaymentRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao processar pagamento: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    throw error;
  }
};

/**
 * Função para criar pagamento PIX no backend
 * @param paymentData Dados do pagamento PIX
 * @returns Resposta com QR code e informações do PIX
 */
export const createPixPaymentRequest = async (paymentData: PixPaymentRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao criar pagamento PIX: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    throw error;
  }
};

/**
 * Função para verificar o status de um pagamento
 * @param paymentId ID do pagamento a ser verificado
 * @returns Status atual do pagamento
 */
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao verificar status do pagamento: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};
