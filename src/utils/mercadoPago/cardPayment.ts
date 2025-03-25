
import { paymentClient, determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey } from './config';

// Create a global process shim to prevent "process is not defined" errors with MercadoPago SDK
if (typeof window !== 'undefined' && !window.process) {
  window.process = { 
    env: {},
    version: '16.0.0', // Provide a node version
    platform: 'browser',
    versions: {
      node: '16.0.0'
    },
    release: {
      name: 'node'
    }
  } as any;
}

// Simulate a backend server endpoint for processing payments
const simulateBackendPaymentAPI = async (paymentData: any): Promise<any> => {
  console.log('Sending payment data to simulated backend:', paymentData);
  
  // In a real implementation, this would be an actual fetch to your backend
  // return fetch('https://your-backend.com/api/process-payment', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(paymentData)
  // }).then(res => res.json());
  
  // For demo purposes: simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Clean card number for testing
  const cleanCardNumber = paymentData.cardData.cardNumber.replace(/\s+/g, '');
  
  // Simulate different payment responses based on test card numbers
  if (cleanCardNumber === '5031433215406351') {
    console.log('Test card detected - simulating successful payment response from backend');
    return {
      id: 'back_' + Math.random().toString(36).substring(2, 15),
      status: 'approved',
      status_detail: 'accredited',
      message: 'Pagamento aprovado com sucesso!'
    };
  }
  
  if (cleanCardNumber === '4000000000000002') {
    console.log('Test card detected - simulating declined payment response from backend');
    return {
      id: 'back_' + Math.random().toString(36).substring(2, 15),
      status: 'rejected',
      status_detail: 'cc_rejected_insufficient_amount',
      message: 'Pagamento rejeitado. Saldo insuficiente.'
    };
  }
  
  if (cleanCardNumber === '4000000000000044') {
    console.log('Test card detected - simulating in_process payment response from backend');
    return {
      id: 'back_' + Math.random().toString(36).substring(2, 15),
      status: 'in_process',
      status_detail: 'pending_contingency',
      message: 'Pagamento em processamento. Aguarde a confirmação.'
    };
  }
  
  // Default success response
  return {
    id: 'back_' + Math.random().toString(36).substring(2, 15),
    status: 'approved',
    status_detail: 'accredited',
    message: 'Pagamento aprovado com sucesso! (Modo de demonstração)'
  };
};

// Function to directly process a card payment without redirection
export const processCardPayment = async (cardData: any, formData: any, installments: number = 1, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    console.log('Processing credit card payment with amount:', amount, 'and description:', description);
    
    if (!window.MercadoPago) {
      console.error('MercadoPago SDK not loaded');
      return {
        status: 'error',
        status_detail: 'MercadoPago SDK not loaded',
        message: 'Erro ao carregar o processador de pagamentos. Recarregue a página e tente novamente.'
      };
    }
    
    // Validate form data
    if (!formData.nome || !formData.email || !formData.cpf) {
      console.error('Missing required form data for card payment');
      return {
        status: 'error',
        status_detail: 'Missing required form data',
        message: 'Dados incompletos. Por favor, preencha todos os campos obrigatórios.'
      };
    }
    
    // Validate card data
    if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expirationDate || !cardData.securityCode) {
      console.error('Missing required card data');
      return {
        status: 'error',
        status_detail: 'Missing required card data',
        message: 'Dados do cartão incompletos. Por favor, preencha todos os campos do cartão.'
      };
    }
    
    console.log('Processing payment through simulated backend integration');
    
    try {
      // 1. Simulate card tokenization process (normally done with MercadoPago.js)
      console.log('Simulating card tokenization');
      
      // Extract month and year from expiration date (MM/YY)
      const [expMonth, expYear] = cardData.expirationDate.split('/');
      
      // Format CPF properly
      const cpf = formData.cpf.replace(/\D/g, '');
      
      // Create a simulated tokenization object that would be sent to MercadoPago
      const tokenizationData = {
        cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
        cardholderName: cardData.cardholderName,
        expirationMonth: expMonth,
        expirationYear: `20${expYear}`,
        securityCode: cardData.securityCode,
        identificationType: 'CPF',
        identificationNumber: cpf
      };
      
      console.log('Generated tokenization data (sensitive details hidden):', {
        ...tokenizationData,
        cardNumber: '****' + tokenizationData.cardNumber.slice(-4),
        securityCode: '***'
      });
      
      // 2. In a real implementation, we would now send the token to the backend
      // along with payment details, but we'll simulate the backend response
      const paymentResponseFromBackend = await simulateBackendPaymentAPI({
        cardData: tokenizationData,
        formData: {
          email: formData.email,
          cpf: cpf
        },
        transactionDetails: {
          amount: amount,
          description: description,
          installments: installments
        }
      });
      
      console.log('Payment response from backend:', paymentResponseFromBackend);
      
      // 3. Return the payment result to update the UI
      return paymentResponseFromBackend;
      
    } catch (tokenError: any) {
      console.error('Error processing card payment:', tokenError);
      
      // Extract the specific error message if available
      let errorMessage = 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.';
      
      if (tokenError.cause) {
        console.error('Error cause:', tokenError.cause);
        errorMessage = 'Falha ao processar pagamento: ' + (tokenError.message || tokenError.toString());
      }
      
      return {
        status: 'rejected',
        status_detail: tokenError.message || 'card_error',
        message: errorMessage
      };
    }
  } catch (error: any) {
    console.error('Error processing direct card payment:', error);
    return {
      status: 'error',
      status_detail: error.message || 'Falha ao processar o pagamento',
      message: 'Falha ao processar o pagamento. Por favor, verifique os dados do cartão e tente novamente.'
    };
  }
};
