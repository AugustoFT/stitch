
// Função para verificar ambiente de desenvolvimento
export const isDevelopmentEnvironment = () => {
  return import.meta.env.DEV;
};

// Função para verificar se rodando localmente
export const isLocalHost = () => {
  return typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
};

// Função para forçar modo de produção (independente do ambiente)
export const forceProductionMode = () => {
  console.log('FORÇANDO MODO DE PRODUÇÃO!');
  return true;
};

// Função para obter URL da Supabase Function
export const getSupabaseEndpoint = () => {
  // Obter a URL correta do .env
  return import.meta.env.VITE_SUPABASE_FUNCTION_URL;
};
