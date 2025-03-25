
// Environment detection utilities

// Check if running in development environment
export const isDevelopmentEnvironment = (): boolean => {
  return import.meta.env.DEV === true;
};

// Force production mode for testing production environment in development
// This will be set to true to force production behavior even when in development
export const forceProductionMode = true;

// Log current environment status
console.log(`Running in ${isDevelopmentEnvironment() ? 'DEVELOPMENT' : 'PRODUCTION'} environment`);
if (forceProductionMode) {
  console.log('Production mode is FORCED for all environments');
}
