
import { corsHeaders } from '../_shared/cors.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

export async function checkPaymentStatus(req: Request, url: URL) {
  try {
    const paymentId = url.searchParams.get('id');
    
    if (!paymentId) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'ID do pagamento não fornecido' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
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
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: responseData.message || 'Erro ao verificar status do pagamento' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        id: responseData.id.toString(),
        status: responseData.status,
        status_detail: responseData.status_detail
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno no servidor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
}
