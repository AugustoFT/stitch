
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize the MercadoPago client with production credentials
const mercadoPagoPublicKey = 'APP_USR-46646251-3224-483c-b69d-85c5f8c96428';

// Configure MercadoPago with access token - for server-side operations
// In a real production app, this would typically be in a server environment
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-6405882494224029-030315-88737fea58568b8cc6d16c0be760c632-1082540248' 
});

// Create an instance of the Preference client
const preferenceClient = new Preference(client);

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

// Function to redirect to MercadoPago checkout
export const redirectToMercadoPagoCheckout = (preferenceId: string) => {
  // Get the checkout URL
  const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
  console.log('Redirecting to MercadoPago checkout:', checkoutUrl);
  
  // In production, we actually redirect
  window.location.href = checkoutUrl;
};
