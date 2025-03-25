
import { determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey, API_BASE_URL } from './config';

// Criar shim para process para evitar erros "process is not defined" com o SDK do MercadoPago
if (typeof window !== 'undefined' && !window.process) {
  window.process = { 
    env: {},
    version: '16.0.0',
    platform: 'browser',
    versions: {
      node: '16.0.0'
    },
    release: {
      name: 'node'
    }
  } as any;
}

// Função para processar pagamento com cartão
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
    
    // Validar dados do formulário
    if (!formData.nome || !formData.email || !formData.cpf) {
      console.error('Dados de formulário obrigatórios ausentes para pagamento com cartão');
      return {
        status: 'error',
        status_detail: 'Missing required form data',
        message: 'Dados incompletos. Por favor, preencha todos os campos obrigatórios.'
      };
    }
    
    // Validar dados do cartão
    if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expirationDate || !cardData.securityCode) {
      console.error('Dados de cartão obrigatórios ausentes');
      return {
        status: 'error',
        status_detail: 'Missing required card data',
        message: 'Dados do cartão incompletos. Por favor, preencha todos os campos do cartão.'
      };
    }
    
    try {
      // 1. Inicializar o MercadoPago.js para tokenização
      console.log('Inicializando tokenização de cartão com MercadoPago.js');
      const mp = new window.MercadoPago(mercadoPagoPublicKey);
      
      // Extrair mês e ano da data de validade (MM/AA)
      const [expMonth, expYear] = cardData.expirationDate.split('/');
      
      // Formatar CPF corretamente
      const cpf = formData.cpf.replace(/\D/g, '');
      
      // 2. Tokenizar o cartão usando MercadoPago.js
      console.log('Tokenizando dados do cartão...');
      const cardTokenData = {
        cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: expMonth,
        cardExpirationYear: `20${expYear}`,
        securityCode: cardData.securityCode,
        identificationType: 'CPF',
        identificationNumber: cpf
      };
      
      // Log seguro (omitindo dados sensíveis)
      console.log('Dados para tokenização (detalhes sensíveis omitidos):', {
        ...cardTokenData,
        cardNumber: '****' + cardTokenData.cardNumber.slice(-4),
        securityCode: '***'
      });
      
      // Tokenizar cartão
      const cardToken = await mp.createCardToken(cardTokenData);
      
      if (!cardToken || !cardToken.id) {
        throw new Error('Falha ao gerar token do cartão');
      }
      
      console.log('Token do cartão gerado com sucesso:', cardToken.id);
      
      // 3. Enviar token e dados de pagamento para o backend
      console.log('Enviando dados de pagamento para o backend');
      
      const backendPaymentData = {
        token: cardToken.id,
        paymentMethod: determineCardType(cardData.cardNumber),
        installments: installments,
        transactionAmount: amount,
        description: description,
        payer: {
          email: formData.email,
          identification: {
            type: "CPF",
            number: cpf
          }
        }
      };
      
      // Enviar para o endpoint de pagamento do backend
      const paymentResponse = await fetch(`${API_BASE_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPaymentData)
      });
      
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento no servidor');
      }
      
      // 4. Receber e retornar a resposta do backend
      const paymentResult = await paymentResponse.json();
      console.log('Resposta do pagamento do backend:', paymentResult);
      
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
    console.error('Erro ao processar pagamento direto com cartão:', error);
    return {
      status: 'error',
      status_detail: error.message || 'Falha ao processar o pagamento',
      message: 'Falha ao processar o pagamento. Por favor, verifique os dados do cartão e tente novamente.'
    };
  }
};

// Para facilitar testes durante o desenvolvimento, adicionamos uma versão de fallback
// que pode ser usada quando a API backend não estiver disponível
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
  
  // Resposta padrão
  return {
    id: 'dev_' + Math.random().toString(36).substring(2, 15),
    status: 'approved',
    status_detail: 'accredited',
    message: 'Pagamento aprovado com sucesso! (Modo de demonstração)'
  };
};
