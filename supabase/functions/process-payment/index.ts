
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { processCardPayment, createPixPayment, checkPaymentStatus } from './handlers.ts';
import { handleCorsRequest, createErrorResponse } from './utils.ts';

// Main handler to route requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Route requests based on path and method
    if (req.method === 'POST') {
      if (path === 'card') {
        return await processCardPayment(req);
      } else if (path === 'pix') {
        return await createPixPayment(req);
      }
    } else if (req.method === 'GET' && path === 'status') {
      return await checkPaymentStatus(req, url);
    }
    
    return new Response(
      JSON.stringify({ error: 'Endpoint não encontrado' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 404 
      }
    );
  } catch (error) {
    console.error('Erro no processamento da requisição:', error);
    return createErrorResponse(error.message || 'Erro interno no servidor');
  }
});
