
import { preferenceClient, ExtendedPreferenceResponse } from './config';

// Function specifically for creating PIX payments
export const createPixPayment = async (formData: any, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    // Create the preference for PIX
    const preferenceData = {
      items: [
        {
          id: 'pelucia-stitch',
          title: description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: amount
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
    
    return {
      id: response.id,
      // Safely access nested properties using optional chaining
      qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64 || null,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code || 'mockPixQrCode12345' // Fallback for testing
    };
  } catch (error) {
    console.error('Error creating MercadoPago PIX payment:', error);
    throw new Error('Falha ao gerar o pagamento PIX. Por favor, tente novamente.');
  }
};
