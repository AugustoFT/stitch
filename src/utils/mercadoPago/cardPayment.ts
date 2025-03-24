
import { paymentClient, determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey } from './config';

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
    
    console.log('Processing direct card payment with MercadoPago');
    
    try {
      // For direct card processing, we need to create a card token first
      const mp = new window.MercadoPago(mercadoPagoPublicKey);
      
      // Format expiration month and year from MM/YY format
      const [expirationMonth, expirationYear] = cardData.expirationDate.split('/');
      
      // Format CPF properly
      const cpf = formData.cpf.replace(/\D/g, '');
      
      // Create a card token using the MercadoPago SDK
      const cardTokenData = {
        cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: `20${expirationYear}`, // Add '20' prefix to make it 4 digits
        securityCode: cardData.securityCode,
        identificationType: 'CPF',
        identificationNumber: cpf
      };
      
      console.log('Creating card token with data:', {
        ...cardTokenData,
        cardNumber: cardTokenData.cardNumber.slice(0, 4) + '******' + cardTokenData.cardNumber.slice(-4), // Mask card number for logs
        securityCode: '***' // Mask security code
      });
      
      // Test card for successful payment: 5031 4332 1540 6351
      // Test expiration: Any future date in MM/YY format
      // Test CVV: 123
      // Test Name: Any name
      
      const cardToken = await mp.createCardToken(cardTokenData);
      console.log('Card token created:', cardToken);
      
      if (!cardToken || !cardToken.id) {
        console.error('Failed to create card token');
        return {
          status: 'rejected',
          status_detail: 'token_creation_error',
          message: 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.'
        };
      }
      
      // Process the payment using the token
      const paymentMethodId = determineCardType(cardData.cardNumber);
      console.log('Detected payment method ID:', paymentMethodId);
      
      const paymentData = {
        transaction_amount: amount,
        token: cardToken.id,
        description: description,
        installments: installments,
        payment_method_id: paymentMethodId,
        payer: {
          email: formData.email,
          identification: {
            type: 'CPF',
            number: cpf
          },
          first_name: formData.nome.split(' ')[0],
          last_name: formData.nome.split(' ').slice(1).join(' ') || formData.nome.split(' ')[0]
        }
      };
      
      console.log('Creating payment with data:', {
        ...paymentData,
        token: '********' // Mask token for logs
      });
      
      // Creating payment with MercadoPago
      const payment = await paymentClient.create({ body: paymentData });
      
      console.log('Payment response:', payment);
      
      return {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        message: getPaymentStatusMessage(payment.status)
      };
    } catch (tokenError: any) {
      console.error('Error creating card token or processing payment:', tokenError);
      
      // Extract the specific error message from Mercado Pago response if available
      let errorMessage = 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.';
      
      if (tokenError.cause) {
        console.error('Token error cause:', tokenError.cause);
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
