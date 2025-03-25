
import { isDevelopmentEnvironment } from './environment';

// Get the correct API endpoint based on environment
export const getApiEndpoint = () => {
  // Always use the environment variable for the endpoint
  const apiEndpoint = import.meta.env.VITE_SUPABASE_FUNCTION_URL || '';
  console.log('Using API endpoint:', apiEndpoint);
  
  if (!apiEndpoint) {
    console.warn('API endpoint not configured. Please check your environment variables.');
  }
  
  return apiEndpoint;
};

// Process card payment through backend API
export const processCardPaymentRequest = async (paymentData: any) => {
  try {
    const apiEndpoint = getApiEndpoint();
    
    if (!apiEndpoint) {
      throw new Error('API endpoint not configured');
    }
    
    console.log('Enviando solicitação de pagamento com cartão para o backend:', {
      amount: paymentData.transactionAmount,
      installments: paymentData.installments,
      description: paymentData.description
    });
    
    // Ensure we're using the correct URL format without double-slashes
    const url = `${apiEndpoint}/card`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Erro na resposta do servidor:', errorData || response.statusText);
      
      return {
        status: 'rejected',
        status_detail: errorData?.message || 'Erro no servidor',
        message: errorData?.message || 'Falha ao processar pagamento',
      };
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento:', error);
    
    return {
      status: 'error',
      status_detail: error.message || 'Falha na comunicação',
      message: 'Falha ao conectar ao servidor de pagamento. Verifique sua conexão ou tente novamente mais tarde.',
    };
  }
};

// Create PIX payment through backend API
export const createPixPaymentRequest = async (paymentData: any) => {
  try {
    const apiEndpoint = getApiEndpoint();
    
    if (!apiEndpoint) {
      throw new Error('API endpoint not configured');
    }
    
    console.log('Enviando solicitação de pagamento PIX para o backend:', {
      amount: paymentData.transactionAmount,
      description: paymentData.description
    });
    
    // Ensure we're using the correct URL format without double-slashes
    const url = `${apiEndpoint}/pix`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Erro na resposta do servidor (PIX):', errorData || response.statusText);
      
      throw new Error(errorData?.message || 'Falha ao processar pagamento PIX');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Erro na requisição de pagamento PIX:', error);
    throw new Error('Failed to fetch');
  }
};

// Simulate offline responses for testing
export const simulateCardPaymentResponse = (cardNumber: string) => {
  // Last 4 digits determine test response
  const lastDigits = cardNumber.replace(/\D/g, '').slice(-4);
  
  if (lastDigits === '0000') {
    return { 
      status: 'rejected', 
      status_detail: 'cc_rejected_card_disabled',
      message: 'Cartão desativado' 
    };
  } else if (lastDigits === '1111') {
    return { 
      status: 'rejected', 
      status_detail: 'cc_rejected_insufficient_amount',
      message: 'Saldo insuficiente' 
    };
  } else if (lastDigits === '2222') {
    return { 
      status: 'in_process', 
      status_detail: 'pending_review_manual',
      message: 'Pagamento em análise' 
    };
  } else {
    return { 
      status: 'approved', 
      status_detail: 'accredited',
      id: Math.floor(Math.random() * 1000000000).toString(),
      message: 'Pagamento aprovado' 
    };
  }
};

// Simulate PIX payment response for testing
export const simulatePixPaymentResponse = () => {
  const id = Math.floor(Math.random() * 1000000000).toString();
  
  return {
    id,
    status: 'pending',
    qr_code: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
    qr_code_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAE0UlEQVR4nO3dwW4bOxBFQcfI/385TrZZGAhsPc0ZqHY/ue0ruC2Kev398+fP19LXr19/fPc/f/++z9tP/95P/vRP/srXsq+Fbpm7/+13/pNfn/ft61/gCQEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEI9/fr91//fn/9++tO0erv3D7J6ae/fZLv9knuy3IChBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcGuf5P7bvrOTdPtJpp9q+ndOf87pp3JfHjgBwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAuLVPsn2i6c+0fUvR9meaXv30/d+X507NE+EEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhFv7JNO3FG2fZPqpbt9SNP2cnn96bgLhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIRb+yTbTz9929HqyezvEH/A86fnJhBOAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQLi1T7J9S9H0ZdV/5wak6VO5L7fcl+UECCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4dY+yfYtRfdn+gVYn2T6MplHl+UECCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4QQg3NonmT7J9GeafpLp57zP9pdXv2d+Kk5PAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQDgBCCcA4QQgnACEE4BwAhBOAMIJQLi1T7J9W8/0U01/6+kTTZ9z+uW4r7AjYALhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCDc+vr7bbv2fbt0+kmOL8Ca/vTT7Cg4PAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDh1j7J9E/v9GVH07/tOzsC3MmP57EsCzmcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHBrn+T4lqLj5zx+zvs8XjeTdiTkBggnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOHWPsntE9n/8N+38kxfmTX9VLdvKfLcPuV9WU6AcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQbu2TbJ9o+kTTl1X/ne/7uif8tuMv5cMLnBaAHxOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcGuPhPvtTzL9naafZPo579u+M2v7Saa/P8/lBAgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOEEIJwAhBOAcAIQTgDCCUA4AQgnAOHWPsl2x5cdbX//7/uT3l/57Rv2HzmXEyCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIQTgHACEE4AwglAOAEIJwDhBCCcAIT7G772kkDByjffAAAAAElFTkSuQmCC'
  };
};
