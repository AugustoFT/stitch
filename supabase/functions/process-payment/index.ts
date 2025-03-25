
// Import directly from Deno standard library with a fixed version
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";
import { processCardPayment, createPixPayment, checkPaymentStatus } from "./handlers.ts";
import { handleCorsRequest } from "./utils.ts";

// Always log the CORS headers for debug
console.log('CORS Headers configured:', corsHeaders);

serve(async (req) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  
  // Handle CORS preflight requests - VERY IMPORTANT!
  if (req.method === 'OPTIONS') {
    console.log('Responding to OPTIONS request (CORS preflight)');
    return handleCorsRequest();
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    console.log(`Processing ${req.method} request for path: ${path}`);
    
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
      JSON.stringify({ error: 'Endpoint not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 404 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
