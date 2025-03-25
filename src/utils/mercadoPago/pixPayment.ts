
import { preferenceClient, ExtendedPreferenceResponse } from './config';

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

// Function specifically for creating PIX payments
export const createPixPayment = async (formData: any, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    console.log('Creating PIX payment with amount:', amount, 'and description:', description);
    
    // Validate form data
    if (!formData.nome || !formData.email || !formData.cpf) {
      console.error('Missing required form data for PIX payment');
      throw new Error('Dados incompletos. Por favor, preencha todos os campos obrigatórios.');
    }
    
    // Format CPF properly
    const cpf = formData.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      console.error('Invalid CPF length:', cpf.length);
      throw new Error('CPF inválido. Por favor, verifique o número do CPF.');
    }
    
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
          number: cpf
        },
        first_name: formData.nome.split(' ')[0],
        last_name: formData.nome.split(' ').slice(1).join(' ') || formData.nome.split(' ')[0]
      },
      payment_methods: {
        default_payment_method_id: 'pix',
        excluded_payment_types: [
          { id: 'credit_card' },
          { id: 'debit_card' },
          { id: 'ticket' }
        ]
      },
      // Enforce HTTPS for all notification URLs
      notification_url: window.location.origin.replace('http:', 'https:') + '/api/notifications',
      // Ensure back_urls use HTTPS
      back_urls: {
        success: window.location.origin.replace('http:', 'https:') + '/success',
        failure: window.location.origin.replace('http:', 'https:') + '/failure',
        pending: window.location.origin.replace('http:', 'https:') + '/pending'
      }
    };
    
    console.log('Creating PIX preference with data:', JSON.stringify(preferenceData));
    
    // Create the preference using MercadoPago
    const response = await preferenceClient.create({ body: preferenceData }) as ExtendedPreferenceResponse;
    
    console.log('PIX preference response:', JSON.stringify(response));
    
    // Check if PIX data was received correctly
    if (!response.id) {
      console.error('No preference ID returned from MercadoPago');
      throw new Error('Falha ao gerar código PIX. Resposta inválida do servidor de pagamento.');
    }
    
    // If point_of_interaction is not available, try to access it via any available property
    const transactionData = response.point_of_interaction?.transaction_data;
    
    if (!transactionData || (!transactionData.qr_code && !transactionData.qr_code_base64)) {
      console.error('PIX code not found in response', response);
      
      // Return a valid response object even without QR code for debugging
      return {
        id: response.id,
        qr_code_base64: null,
        qr_code: null,
        error: 'QR code not found in response',
        fullResponse: JSON.stringify(response)
      };
    }
    
    return {
      id: response.id,
      qr_code_base64: transactionData.qr_code_base64 || null,
      qr_code: transactionData.qr_code || null
    };
  } catch (error: any) {
    console.error('Error creating MercadoPago PIX payment:', error);
    throw new Error(error.message || 'Falha ao gerar o pagamento PIX. Por favor, tente novamente.');
  }
};
