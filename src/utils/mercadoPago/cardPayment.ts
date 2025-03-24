
import { paymentClient, determineCardType, getPaymentStatusMessage, mercadoPagoPublicKey } from './config';

// Function to directly process a card payment without redirection
export const processCardPayment = async (cardData: any, formData: any, installments: number = 1, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    if (!window.MercadoPago) {
      console.error('MercadoPago SDK not loaded');
      throw new Error('MercadoPago SDK not loaded');
    }
    
    console.log('Processing direct card payment with MercadoPago');
    
    // For direct card processing, we need to create a card token first
    const mp = new window.MercadoPago(mercadoPagoPublicKey);
    
    // Format expiration month and year from MM/YY format
    const [expirationMonth, expirationYear] = cardData.expirationDate.split('/');
    
    // Create a card token using the MercadoPago SDK
    const cardTokenData = {
      cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      cardholderName: cardData.cardholderName,
      cardExpirationMonth: expirationMonth,
      cardExpirationYear: `20${expirationYear}`, // Add '20' prefix to make it 4 digits
      securityCode: cardData.securityCode,
      identificationType: 'CPF',
      identificationNumber: formData.cpf.replace(/\D/g, '')
    };
    
    console.log('Creating card token with data:', {
      ...cardTokenData,
      cardNumber: cardTokenData.cardNumber.slice(0, 4) + '******' + cardTokenData.cardNumber.slice(-4) // Mask card number for logs
    });
    
    try {
      const cardToken = await mp.createCardToken(cardTokenData);
      console.log('Card token created:', cardToken);
      
      if (!cardToken || !cardToken.id) {
        throw new Error('Failed to create card token');
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
            number: formData.cpf.replace(/\D/g, '')
          }
        }
      };
      
      console.log('Creating payment with data:', {
        ...paymentData,
        token: '********' // Mask token for logs
      });
      
      // In a real implementation, this would be a server-side call
      // For demonstration, we're doing it client-side (not recommended for production)
      const payment = await paymentClient.create({ body: paymentData });
      
      console.log('Payment response:', payment);
      
      return {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        message: getPaymentStatusMessage(payment.status)
      };
    } catch (tokenError) {
      console.error('Error creating card token:', tokenError);
      return {
        status: 'rejected',
        status_detail: 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.',
        message: 'Erro nos dados do cartão. Verifique o número, data de validade e CVV.'
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
