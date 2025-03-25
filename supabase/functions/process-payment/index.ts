
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";
import { processCardPayment, createPixPayment, checkPaymentStatus } from "./handlers.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request (CORS preflight)');
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': '*',  // Allow all origins in development
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, Apikey, Content-Type',
        'Access-Control-Max-Age': '86400',
      },
      status: 204
    });
  }

  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    
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
    
    // Default error response for unhandled routes
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 500 
      }
    );
  }
});
