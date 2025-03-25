
// Re-export everything from the individual files
export * from './config';
export * from './preferences';
export * from './pixPayment';
export * from './cardPayment';
export * from './api';
export * from './environment';

// Instruções de uso para ambiente de produção vs desenvolvimento
export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

// Controle de ambiente atual
// Configurado para produção por padrão
let currentEnvironment = ENV.PRODUCTION;

/**
 * Define o ambiente atual (produção ou desenvolvimento)
 * @param env Ambiente a ser configurado
 */
export const setEnvironment = (env: string) => {
  if (env === ENV.PRODUCTION || env === ENV.DEVELOPMENT) {
    currentEnvironment = env;
    console.log(`Ambiente do Mercado Pago configurado para: ${env}`);
  } else {
    console.error(`Ambiente inválido: ${env}. Use ENV.PRODUCTION ou ENV.DEVELOPMENT`);
  }
};

/**
 * Retorna o ambiente atual
 * @returns Ambiente atual (produção ou desenvolvimento)
 */
export const getEnvironment = () => {
  return currentEnvironment;
};

/**
 * Verifica se está em ambiente de produção
 * @returns true se estiver em produção
 */
export const isProduction = () => {
  // Sempre retorna true para forçar modo de produção
  return true;
};
