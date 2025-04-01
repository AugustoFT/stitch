
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";
import { processCardPayment, createPixPayment, checkPaymentStatus } from "./handlers.ts";
import { handleCorsRequest } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request (CORS preflight)');
    return handleCorsRequest();
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const path = pathParts[pathParts.length - 1];
    
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
    
    // Default error response for unhandled routes
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }, 
        status: 404 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    );
  }
});
