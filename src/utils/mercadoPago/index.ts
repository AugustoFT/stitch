
// Re-export everything from the individual files
export * from './config';
export * from './preferences';
export * from './pixPayment';
export * from './cardPayment';
export * from './api';
export * from './environment';

// Environment instructions for production vs development
export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

// Environment control
// Set to production by default
let currentEnvironment = ENV.PRODUCTION;

/**
 * Sets the current environment (production or development)
 * @param env Environment to be configured
 */
export const setEnvironment = (env: string) => {
  if (env === ENV.PRODUCTION || env === ENV.DEVELOPMENT) {
    currentEnvironment = env;
    console.log(`Mercado Pago environment set to: ${env}`);
  } else {
    console.error(`Invalid environment: ${env}. Use ENV.PRODUCTION or ENV.DEVELOPMENT`);
  }
};

/**
 * Returns the current environment
 * @returns Current environment (production or development)
 */
export const getEnvironment = () => {
  return currentEnvironment;
};

/**
 * Checks if in production environment
 * @returns true if in production
 */
export const isProduction = () => {
  // Always returns true to force production mode
  return true;
};
