
import { toast } from 'sonner';
import { isDevelopmentEnvironment, getSupabaseEndpoint, forceProductionMode } from './environment';

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
    const endpoint = `${getApiEndpoint()}/card`;
    console.log('Enviando solicitação de pagamento com cartão para o backend:', paymentData);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
      console.error('Erro na resposta do servidor:', errorData);
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    throw error;
  }
};

// Requisição à API para processamento de pagamento PIX
export const createPixPaymentRequest = async (paymentData: any) => {
  try {
    const endpoint = `${getApiEndpoint()}/pix`;
    console.log('Enviando solicitação de pagamento PIX para o backend:', paymentData);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
      console.error('Erro na resposta do servidor:', errorData);
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    throw error;
  }
};

// Requisição à API para verificar status do pagamento
export const checkPaymentStatusRequest = async (paymentId: string) => {
  try {
    const endpoint = `${getApiEndpoint()}/status?id=${paymentId}`;
    console.log('Verificando status do pagamento:', paymentId);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
      console.error('Erro na resposta do servidor:', errorData);
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
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
