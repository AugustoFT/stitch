
// Check if we're in a development environment
export const isDevelopmentEnvironment = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};
