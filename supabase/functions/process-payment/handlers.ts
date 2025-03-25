
import { corsHeaders } from '../_shared/cors.ts';

// Mercado Pago access token from environment
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '';

/**
 * Process credit card payment through Mercado Pago
 */
export async function processCardPayment(req: Request) {
  try {
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

/**
 * Create PIX payment through Mercado Pago
 */
export async function createPixPayment(req: Request) {
  try {
    const { transactionAmount, description, payer } = await req.json();
    
    console.log('Criando pagamento PIX:', { 
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
      console.error('Erro na resposta do Mercado Pago (PIX):', responseData);
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: responseData.message || 'Erro ao processar pagamento PIX' 
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
        point_of_interaction: responseData.point_of_interaction,
        qr_code: responseData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: responseData.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: responseData.point_of_interaction?.transaction_data?.ticket_url
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
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

/**
 * Check payment status in Mercado Pago
 */
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
