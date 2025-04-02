
import { toast } from 'sonner';
import { isDevelopmentEnvironment, getSupabaseEndpoint, forceProductionMode } from './environment';
import { supabase } from '../../integrations/supabase/client';

// Função auxiliar para determinar o endpoint correto
export const getApiEndpoint = () => {
  // Lemos a variável de ambiente para a URL da função
  const functionUrl = getSupabaseEndpoint();
  console.log('Using API endpoint:', functionUrl);
  return functionUrl;
};

// Requisição à API para processamento de pagamento com cartão
export const processCardPaymentRequest = async (paymentData: any) => {
  try {
    console.log('Enviando solicitação de pagamento com cartão para o backend:', paymentData);
    
    // Make sure transaction amount is a valid number and at least 0.5 for production
    const rawAmount = Number(paymentData.transactionAmount);
    const minimumAmount = 0.5; // Minimum amount required by Mercado Pago
    const formattedAmount = Math.max(rawAmount, minimumAmount);
    
    const formattedPaymentData = {
      ...paymentData,
      transactionAmount: formattedAmount
    };
    
    console.log('Formatted payment data with amount:', formattedAmount);
    
    // Usar supabase.functions.invoke para tratar autorização automaticamente
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        pathname: '/card',
        ...formattedPaymentData
      }
    });
    
    if (error) {
      console.error('Erro na resposta do servidor:', error);
      throw new Error(error.message || `Erro ao processar pagamento`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    throw error;
  }
};

// Requisição à API para processamento de pagamento PIX
export const createPixPaymentRequest = async (paymentData: any) => {
  try {
    console.log('Enviando solicitação de pagamento PIX para o backend:', paymentData);
    
    // Make sure transaction amount is a valid number
    const formattedPaymentData = {
      ...paymentData,
      transactionAmount: Number(paymentData.transactionAmount) // Ensure it's a number, not a string
    };
    
    console.log('Formatted PIX payment data:', formattedPaymentData);
    
    // Usar supabase.functions.invoke para tratar autorização automaticamente
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        pathname: '/pix',
        ...formattedPaymentData
      }
    });
    
    if (error) {
      console.error('Erro na resposta do servidor:', error);
      throw new Error(error.message || `Erro ao processar pagamento PIX`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    throw error;
  }
};

// Requisição à API para verificar status do pagamento
export const checkPaymentStatusRequest = async (paymentId: string) => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    // Usar supabase.functions.invoke para tratar autorização automaticamente
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        pathname: '/status',
        id: paymentId
      }
    });
    
    if (error) {
      console.error('Erro na resposta do servidor:', error);
      throw new Error(error.message || `Erro ao verificar status do pagamento`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

// Funções para simulação em ambiente de desenvolvimento (mantidas por compatibilidade)
export const simulateCardPaymentResponse = (paymentData: any) => {
  // Simulação simplificada (mantida para compatibilidade)
  return {
    status: 'approved',
    status_detail: 'accredited',
    id: '12345678',
    message: 'Pagamento aprovado com sucesso'
  };
};

export const simulatePixPaymentResponse = (paymentData: any) => {
  // Simulação simplificada (mantida para compatibilidade)
  return {
    id: '12345678',
    status: 'pending',
    qr_code: 'QRCODE_EXAMPLE',
    qr_code_base64: 'BASE64_STRING',
    ticket_url: 'https://www.example.com/pix'
  };
};
