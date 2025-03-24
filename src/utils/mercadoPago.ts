
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Initialize the MercadoPago client with production credentials
const mercadoPagoPublicKey = 'APP_USR-46646251-3224-483c-b69d-85c5f8c96428';

// Configure MercadoPago with access token - for server-side operations
// In a real production app, this would typically be in a server environment
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-6405882494224029-030315-88737fea58568b8cc6d16c0be760c632-1082540248' 
});

// Create an instance of the Preference client
const preferenceClient = new Preference(client);

// Create an instance of the Payment client for credit card payments
const paymentClient = new Payment(client);

// Extended PreferenceResponse interface to include point_of_interaction
interface ExtendedPreferenceResponse {
  id: string;
  init_point: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
    }
  }
}

// This function creates a checkout preference
export const createPreference = async (formData: any) => {
  try {
    // Create the preference structure
    const preferenceData = {
      items: [
        {
          id: 'pelucia-stitch',
          title: 'Pelúcia Stitch',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 139.99
        }
      ],
      payer: {
        name: formData.nome,
        email: formData.email,
        phone: {
          area_code: formData.telefone.substring(0, 2),
          number: formData.telefone.substring(2).replace(/\D/g, '')
        },
        address: {
          street_name: formData.endereco,
          street_number: '',
          zip_code: formData.cep.replace(/\D/g, '')
        }
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      back_urls: {
        success: window.location.origin,
        failure: window.location.origin,
        pending: window.location.origin
      },
      auto_return: 'approved'
    };

    console.log('Creating preference with data:', preferenceData);
    
    // Create the preference using MercadoPago
    const response = await preferenceClient.create({ body: preferenceData });
    
    return {
      id: response.id,
      init_point: response.init_point
    };
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Falha ao processar o pagamento. Por favor, tente novamente.');
  }
};

// This function initializes the checkout
export const initMercadoPago = () => {
  console.log('MercadoPago initialized with public key:', mercadoPagoPublicKey);
  return mercadoPagoPublicKey;
};

// Function specifically for creating PIX payments
export const createPixPayment = async (formData: any) => {
  try {
    // Create the preference for PIX
    const preferenceData = {
      items: [
        {
          id: 'pelucia-stitch',
          title: 'Pelúcia Stitch',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 139.99
        }
      ],
      payer: {
        name: formData.nome,
        email: formData.email,
        identification: {
          type: 'CPF',
          number: formData.cpf || '00000000000' // Default for testing
        }
      },
      payment_methods: {
        default_payment_method_id: 'pix'
      }
    };
    
    console.log('Creating PIX preference with data:', preferenceData);
    
    // Create the preference using MercadoPago
    const response = await preferenceClient.create({ body: preferenceData }) as ExtendedPreferenceResponse;
    
    // The response from the API might not include point_of_interaction directly
    // Let's handle this more safely by checking the structure
    console.log('PIX preference response:', response);
    
    // Return a mock QR code for testing if the real one is not available
    // In production, you'd need to properly handle this with a server-side component
    return {
      id: response.id,
      // Safely access nested properties using optional chaining
      qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64 || null,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code || 
               'mockPixQrCode12345' // Fallback for testing
    };
  } catch (error) {
    console.error('Error creating MercadoPago PIX payment:', error);
    throw new Error('Falha ao gerar o pagamento PIX. Por favor, tente novamente.');
  }
};

// Function to directly process a card payment without redirection
export const processCardPayment = async (cardData: any, formData: any) => {
  try {
    if (!window.MercadoPago) {
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
    
    const cardToken = await mp.createCardToken(cardTokenData);
    console.log('Card token created:', cardToken);
    
    if (!cardToken || !cardToken.id) {
      throw new Error('Failed to create card token');
    }
    
    // Process the payment using the token
    const paymentData = {
      transaction_amount: 139.99,
      token: cardToken.id,
      description: 'Pelúcia Stitch',
      installments: 1,
      payment_method_id: determineCardType(cardData.cardNumber),
      payer: {
        email: formData.email,
        identification: {
          type: 'CPF',
          number: formData.cpf.replace(/\D/g, '')
        }
      }
    };
    
    console.log('Creating payment with data:', paymentData);
    
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
  } catch (error) {
    console.error('Error processing direct card payment:', error);
    throw new Error('Falha ao processar o pagamento. Por favor, verifique os dados do cartão e tente novamente.');
  }
};

// Helper function to determine card type from card number
function determineCardType(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'master';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^(60|65)/.test(cleanNumber)) return 'elo';
  
  // Default to visa if can't determine
  return 'visa';
}

// Helper function to get human-readable message for payment status
function getPaymentStatusMessage(status: string): string {
  switch (status) {
    case 'approved':
      return 'Pagamento aprovado com sucesso!';
    case 'in_process':
    case 'pending':
      return 'Pagamento em processamento. Aguarde a confirmação.';
    case 'rejected':
      return 'Pagamento rejeitado. Verifique os dados do cartão.';
    default:
      return `Status do pagamento: ${status}`;
  }
}
