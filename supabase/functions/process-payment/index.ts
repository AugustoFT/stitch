
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
    // Parse the JSON body
    const { pathname, ...data } = await req.json();
    console.log(`Processing request for path: ${pathname}`);
    
    // Route requests based on path
    if (pathname === '/card') {
      // Create a new request object to pass to the handler
      const cardReq = new Request(req.url, {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(data)
      });
      return await processCardPayment(cardReq);
    } else if (pathname === '/pix') {
      // Create a new request object to pass to the handler
      const pixReq = new Request(req.url, {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(data)
      });
      return await createPixPayment(pixReq);
    } else if (pathname === '/status') {
      // Create a URL with the ID as a query parameter
      const statusUrl = new URL(req.url);
      statusUrl.searchParams.set('id', data.id);
      
      // Create a new request object with the updated URL
      const statusReq = new Request(statusUrl.toString(), {
        method: 'GET',
        headers: req.headers
      });
      return await checkPaymentStatus(statusReq, statusUrl);
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
