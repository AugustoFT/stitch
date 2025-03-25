
import { corsHeaders } from './_shared/cors.ts';

/**
 * Create a properly formatted JSON response
 */
export function createJsonResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status 
    }
  );
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsRequest() {
  return new Response(null, { 
    headers: corsHeaders,
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
    message: message || 'Erro interno no servidor' 
  }, status);
}
