
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../utils.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

export async function createPixPayment(req: Request) {
  try {
    console.log('Initiating PIX payment creation');
    
    const { transactionAmount, description, payer } = await req.json();
    
    console.log('Creating PIX payment:', { 
      transactionAmount, 
      description 
    });
    
    // Prepare data for Mercado Pago
    const payload = {
      transaction_amount: Number(transactionAmount),
      description,
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
        first_name: payer.firstName,
        last_name: payer.lastName,
        identification: payer.identification
      }
    };
    
    // Send to Mercado Pago API
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseData = await mpResponse.json();
    
    if (!mpResponse.ok) {
      console.error('Error in Mercado Pago response (PIX):', responseData);
      return createErrorResponse(responseData.message || 'Error processing PIX payment', 400);
    }
    
    return createJsonResponse({
      id: responseData.id.toString(),
      status: responseData.status,
      point_of_interaction: responseData.point_of_interaction,
      qr_code: responseData.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: responseData.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: responseData.point_of_interaction?.transaction_data?.ticket_url
    });
  } catch (error) {
    console.error('Error creating PIX payment:', error);
    return createErrorResponse(error.message || 'Internal server error', 500);
  }
}
