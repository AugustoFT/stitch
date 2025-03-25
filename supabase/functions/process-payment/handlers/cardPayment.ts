
import { corsHeaders } from '../_shared/cors.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

export async function processCardPayment(req: Request) {
  try {
    console.log('Iniciando processamento de pagamento com cartão');
    
    const { token, paymentMethod, installments, transactionAmount, description, payer } = await req.json();
    
    console.log('Processando pagamento com cartão:', { 
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
    
    console.log('Enviando dados para API do Mercado Pago');
    
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
      console.error('Erro na resposta do Mercado Pago:', responseData);
      return new Response(
        JSON.stringify({ 
          status: 'rejected', 
          status_detail: responseData.message || 'Erro no processamento', 
          message: responseData.message || 'Erro ao processar pagamento'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    console.log('Resposta do Mercado Pago obtida com sucesso:', responseData.status);
    
    return new Response(
      JSON.stringify({
        id: responseData.id.toString(),
        status: responseData.status,
        status_detail: responseData.status_detail,
        message: responseData.status_detail
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
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
