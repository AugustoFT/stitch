
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../utils.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

export async function processCardPayment(req: Request) {
  try {
    console.log('Initiating card payment processing');
    
    const data = await req.json();
    console.log('Received data:', JSON.stringify(data));
    
    const { token, paymentMethod, installments, transactionAmount, description, payer } = data;
    
    if (!token || !paymentMethod || !installments || !transactionAmount || !description || !payer) {
      console.error('Missing required payment fields:', JSON.stringify(data));
      return createErrorResponse('Missing required payment fields', 400);
    }
    
    console.log('Processing card payment:', { 
      paymentMethod, 
      installments, 
      transactionAmount, 
      description 
    });
    
    // Prepare data for Mercado Pago
    const payload = {
      token,
      installments: Number(installments),
      transaction_amount: Number(transactionAmount),
      description,
      payment_method_id: paymentMethod,
      payer: {
        email: payer.email,
        identification: payer.identification
      }
    };
    
    console.log('Sending data to Mercado Pago API with token:', MERCADO_PAGO_ACCESS_TOKEN ? 'Present' : 'Missing');
    
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
      console.error('Error in Mercado Pago response:', responseData);
      return createErrorResponse(responseData.message || 'Error processing payment', 400);
    }
    
    console.log('Mercado Pago response obtained successfully:', responseData.status);
    
    return createJsonResponse({
      id: responseData.id.toString(),
      status: responseData.status,
      status_detail: responseData.status_detail,
      message: responseData.status_detail
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return createErrorResponse(error.message || 'Internal server error', 500);
  }
}
