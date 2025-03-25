
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

/**
 * Função para processar pagamento com cartão diretamente via Mercado Pago
 * @param paymentData Dados do pagamento com cartão
 * @returns Resposta do processamento do pagamento
 */
export const processCardPaymentRequest = async (paymentData: CardPaymentRequest) => {
  try {
    console.log('Processando pagamento com cartão via Mercado Pago:', {
      ...paymentData,
      token: 'XXXX-XXXX-XXXX-XXXX' // Ocultando o token por segurança
    });
    
    const mpPaymentData = {
      token: paymentData.token,
      installments: Number(paymentData.installments),
      transaction_amount: Number(paymentData.transactionAmount),
      description: paymentData.description,
      payment_method_id: paymentData.paymentMethod,
      payer: {
        email: paymentData.payer.email,
        identification: paymentData.payer.identification
      }
    };
    
    const response = await paymentClient.create({ body: mpPaymentData });
    
    return {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      message: response.status_detail
    };
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    const errorMessage = error.cause?.response?.data?.message || error.message || 'Erro ao processar pagamento';
    return {
      status: 'rejected',
      status_detail: 'error',
      message: errorMessage
    };
  }
};

/**
 * Função para criar pagamento PIX diretamente via Mercado Pago
 * @param paymentData Dados do pagamento PIX
 * @returns Resposta com QR code e informações do PIX
 */
export const createPixPaymentRequest = async (paymentData: PixPaymentRequest) => {
  try {
    console.log('Criando pagamento PIX via Mercado Pago:', paymentData);
    
    const mpPaymentData = {
      transaction_amount: Number(paymentData.transactionAmount),
      description: paymentData.description,
      payment_method_id: 'pix',
      payer: {
        email: paymentData.payer.email,
        first_name: paymentData.payer.firstName,
        last_name: paymentData.payer.lastName || paymentData.payer.firstName, // Mercado Pago exige lastName
        identification: paymentData.payer.identification
      }
    };
    
    const response = await paymentClient.create({ body: mpPaymentData });
    
    return {
      id: response.id,
      status: response.status,
      point_of_interaction: response.point_of_interaction
    };
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    const errorMessage = error.cause?.response?.data?.message || error.message || 'Erro ao criar pagamento PIX';
    throw new Error(errorMessage);
  }
};

/**
 * Função para verificar o status de um pagamento
 * @param paymentId ID do pagamento a ser verificado
 * @returns Status atual do pagamento
 */
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    const response = await paymentClient.get({ id: paymentId });
    
    return {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail
    };
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    const errorMessage = error.cause?.response?.data?.message || error.message || 'Erro ao verificar status';
    throw new Error(errorMessage);
  }
};
