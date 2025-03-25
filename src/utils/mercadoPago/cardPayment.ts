
import { processCardPaymentRequest, simulateCardPaymentResponse } from './api';
import { determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey } from './config';
import { setupProcessPolyfill } from './polyfills';
import { validateCardData, validateFormData } from './validators';
import { handleCardTokenization } from './tokenization';
import { isDevelopmentEnvironment } from './environment';

// Initialize process polyfill
setupProcessPolyfill();

// Main function to process card payment
export const processCardPayment = async (cardData: any, formData: any, installments: number = 1, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    console.log('Processando pagamento com cartão no valor de:', amount, 'e descrição:', description);
    
    if (!window.MercadoPago) {
      console.error('SDK do MercadoPago não carregado');
      return {
        status: 'error',
        status_detail: 'MercadoPago SDK not loaded',
        message: 'Erro ao carregar o processador de pagamentos. Recarregue a página e tente novamente.'
      };
    }
    
    // Validate form and card data
    const formValidationError = validateFormData(formData);
    if (formValidationError) return formValidationError;
    
    const cardValidationError = validateCardData(cardData);
    if (cardValidationError) return cardValidationError;
    
    try {
      // Initialize MercadoPago and tokenize card
      console.log('Inicializando tokenização de cartão com MercadoPago.js');
      const mp = new window.MercadoPago(mercadoPagoPublicKey);
      
      // Create card token
      const cardToken = await handleCardTokenization(mp, cardData, formData);
      
      if (!cardToken || !cardToken.id) {
        throw new Error('Falha ao gerar token do cartão');
      }
      
      console.log('Token do cartão gerado com sucesso:', cardToken.id);
      
      // Prepare payment data
      const paymentData = {
        token: cardToken.id,
        paymentMethod: determineCardType(cardData.cardNumber),
        installments: installments,
        transactionAmount: amount,
        description: description,
        payer: {
          email: formData.email,
          identification: {
            type: "CPF",
            number: formData.cpf.replace(/\D/g, '')
          }
        }
      };
      
      // Process payment via our backend or use simulation in development
      let paymentResult;
      
      try {
        // Tenta comunicar com o backend primeiro
        paymentResult = await processCardPaymentRequest(paymentData);
      } catch (connError) {
        console.warn('Erro de conexão com o backend:', connError);
        
        // Se estamos em desenvolvimento, usamos a simulação
        if (isDevelopmentEnvironment()) {
          console.log('Usando modo de simulação devido a erro de conexão');
          paymentResult = simulateCardPaymentResponse(paymentData);
        } else {
          // Em produção, propagamos o erro
          throw connError;
        }
      }
      
      console.log('Resposta do processamento de pagamento:', paymentResult);
      
      return {
        status: paymentResult.status,
        status_detail: paymentResult.status_detail,
        id: paymentResult.id,
        message: paymentResult.message || getPaymentStatusMessage(paymentResult.status)
      };
      
    } catch (tokenError: any) {
      console.error('Erro ao processar pagamento com cartão:', tokenError);
      
      let errorMessage = 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.';
      
      if (tokenError.cause) {
        console.error('Causa do erro:', tokenError.cause);
        errorMessage = 'Falha ao processar pagamento: ' + (tokenError.message || tokenError.toString());
      }
      
      return {
        status: 'rejected',
        status_detail: tokenError.message || 'card_error',
        message: errorMessage
      };
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento com cartão:', error);
    return {
      status: 'error',
      status_detail: error.message || 'Falha ao processar o pagamento',
      message: 'Falha ao processar o pagamento. Por favor, verifique os dados do cartão e tente novamente.'
    };
  }
};

// Offline version for testing
export const processCardPaymentOffline = async (cardData: any, formData: any, installments: number = 1, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  console.log('MODO DESENVOLVIMENTO: Processando pagamento offline (sem API)');
  
  // Simula network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simula diferentes respostas com base nos números de cartão de teste
  const cleanCardNumber = cardData.cardNumber.replace(/\s+/g, '');
  
  if (cleanCardNumber === '5031433215406351') {
    return {
      id: 'dev_' + Math.random().toString(36).substring(2, 15),
      status: 'approved',
      status_detail: 'accredited',
      message: 'Pagamento aprovado com sucesso!'
    };
  }
  
  if (cleanCardNumber === '4000000000000002') {
    return {
      id: 'dev_' + Math.random().toString(36).substring(2, 15),
      status: 'rejected',
      status_detail: 'cc_rejected_insufficient_amount',
      message: 'Pagamento rejeitado. Saldo insuficiente.'
    };
  }
  
  if (cleanCardNumber === '4000000000000044') {
    return {
      id: 'dev_' + Math.random().toString(36).substring(2, 15),
      status: 'in_process',
      status_detail: 'pending_contingency',
      message: 'Pagamento em processamento. Aguarde a confirmação.'
    };
  }
  
  // Resposta padrão para qualquer outro cartão em desenvolvimento
  return {
    id: 'dev_' + Math.random().toString(36).substring(2, 15),
    status: 'approved',
    status_detail: 'accredited',
    message: 'Pagamento aprovado com sucesso! (Modo de demonstração)'
  };
};
