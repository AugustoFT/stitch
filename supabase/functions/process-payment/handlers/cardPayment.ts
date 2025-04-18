
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
    
    // Validate and format transaction amount (must be a positive number)
    // Mercado Pago requires a valid number at least 0.5 in production environments
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount)) {
      console.error('Invalid transaction amount format:', transactionAmount);
      return createErrorResponse('Invalid transaction amount format. Must be a number.', 400);
    }
    
    // Ensure minimum amount is 0.5 for production
    const minimumAmount = 0.5;
    const validAmount = Math.max(amount, minimumAmount);
    
    if (validAmount !== amount) {
      console.log(`Adjusted transaction amount from ${amount} to minimum ${validAmount}`);
    }
    
    console.log('Processing card payment:', { 
      paymentMethod, 
      installments, 
      amount: validAmount, 
      description 
    });
    
    // Prepare data for Mercado Pago
    const payload = {
      token,
      installments: Number(installments),
      transaction_amount: validAmount,
      description,
      payment_method_id: paymentMethod,
      payer: {
        email: payer.email,
        identification: payer.identification
      }
    };
    
    console.log('Sending data to Mercado Pago API with token:', MERCADO_PAGO_ACCESS_TOKEN ? 'Present' : 'Missing');
    console.log('Payment payload:', JSON.stringify(payload));
    
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
      return createErrorResponse(responseData.message || 'Error processing payment', mpResponse.status);
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
