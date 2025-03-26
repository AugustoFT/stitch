
import { corsHeaders } from './_shared/cors.ts';

/**
 * Create a properly formatted JSON response
 */
export function createJsonResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }, 
      status 
    }
  );
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsRequest() {
  return new Response(null, { 
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, Apikey, Content-Type'
    },
    status: 204 
  });
}

/**
 * Create an error response
 */
export function createErrorResponse(message: string, status = 500) {
  console.error(`Error: ${message}`);
  return createJsonResponse({ 
    status: 'error', 
    message: message || 'Internal server error' 
  }, status);
}
