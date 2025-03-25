
// Check if we're in a development environment
export const isDevelopmentEnvironment = () => {
  return false; // Forçar ambiente de produção
  // return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Função para forçar modo de produção
export const forceProductionMode = () => {
  return true;
};
