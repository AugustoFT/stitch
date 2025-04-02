
import { processCardPaymentRequest, simulateCardPaymentResponse } from './api';
import { determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey } from './config';
import { setupProcessPolyfill } from './polyfills';
import { validateCardData, validateFormData } from './validators';
import { handleCardTokenization } from './tokenization';
import { isDevelopmentEnvironment, forceProductionMode } from './environment';

// Initialize process polyfill
setupProcessPolyfill();

// Main function to process card payment
export const processCardPayment = async (cardData: any, formData: any, installments: number = 1, amount: number = 0.5, description: string = 'Pelúcia Stitch') => {
  try {
    console.log('Processando pagamento com cartão no valor de:', amount, 'e descrição:', description);
    console.log('MODO DE PRODUÇÃO ATIVO!');
    
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
      
      // Ensure minimum amount for Mercado Pago (0.5 in production)
      const minimumAmount = 0.5;
      const validAmount = Math.max(Number(amount) || 0.5, minimumAmount);
      
      if (validAmount !== Number(amount)) {
        console.log(`Adjusting amount from ${amount} to minimum ${validAmount}`);
      }
      
      // Prepare payment data
      const paymentData = {
        token: cardToken.id,
        paymentMethod: determineCardType(cardData.cardNumber),
        installments: installments,
        transactionAmount: validAmount,
        description: description,
        payer: {
          email: formData.email,
          identification: {
            type: "CPF",
            number: formData.cpf.replace(/\D/g, '')
          }
        }
      };
      
      console.log('Processando pagamento em ambiente de PRODUÇÃO');
      console.log('Dados de pagamento formatados:', paymentData);
      
      const paymentResult = await processCardPaymentRequest(paymentData);
      
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
export const processCardPaymentOffline = async (cardData: any, formData: any, installments: number = 1, amount: number = 0.05, description: string = 'Pelúcia Stitch') => {
  // No modo de produção, sempre tenta processar via API
  return processCardPayment(cardData, formData, installments, amount, description);
};
