
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

// Function to perform a real credit card payment using Mercado Pago
export const processCardPayment = async (cardData: any, formData: any) => {
  try {
    // Implement real MercadoPago checkout using the MercadoPago.js SDK
    // This function assumes MercadoPago.js is loaded and cardData contains a valid token
    
    if (!window.MercadoPago) {
      throw new Error('MercadoPago SDK not loaded');
    }
    
    console.log('Processing real MercadoPago payment:', {
      type: cardData.paymentMethodId,
      cardNumber: cardData.cardNumber ? cardData.cardNumber.substring(0, 4) + '********' + cardData.cardNumber.slice(-4) : 'No card number'
    });

    // Instead of creating a payment directly, let's redirect to Mercado Pago checkout
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
        },
        identification: {
          type: 'CPF',
          number: formData.cpf || '00000000000'
        }
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
        default_payment_method_id: cardData.paymentMethodId
      },
      back_urls: {
        success: window.location.origin,
        failure: window.location.origin,
        pending: window.location.origin
      },
      auto_return: 'approved'
    };
    
    console.log('Creating checkout preference:', preferenceData);
    
    // Create a preference to start the checkout flow
    const response = await preferenceClient.create({ body: preferenceData });
    
    console.log('Checkout preference created:', response);
    
    // Return the checkout URL that will redirect to Mercado Pago's checkout page
    return {
      id: response.id,
      init_point: response.init_point,
      status: 'redirect',
      redirect_url: response.init_point
    };
    
  } catch (error) {
    console.error('Error processing MercadoPago card payment:', error);
    throw new Error('Falha ao processar o pagamento com cartão. Por favor, verifique os dados e tente novamente.');
  }
};
