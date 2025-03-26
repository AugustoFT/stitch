
import { corsHeaders } from '../_shared/cors.ts';
import { createJsonResponse, createErrorResponse } from '../utils.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

export async function checkPaymentStatus(req: Request, url: URL) {
  try {
    const paymentId = url.searchParams.get('id');
    
    if (!paymentId) {
      return createErrorResponse('Payment ID not provided', 400);
    }
    
    // Check Mercado Pago API
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });
    
    const responseData = await mpResponse.json();
    
    if (!mpResponse.ok) {
      return createErrorResponse(responseData.message || 'Error checking payment status', 400);
    }
    
    return createJsonResponse({
      id: responseData.id.toString(),
      status: responseData.status,
      status_detail: responseData.status_detail
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return createErrorResponse(error.message || 'Internal server error', 500);
  }
}
