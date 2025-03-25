
// Create a process shim to avoid "process is not defined" errors with MercadoPago SDK
export const setupProcessPolyfill = () => {
  if (typeof window !== 'undefined' && !window.process) {
    window.process = { 
      env: {},
      version: '16.0.0',
      platform: 'browser',
      versions: {
        node: '16.0.0'
      },
      release: {
        name: 'node'
      }
    } as any;
  }
};
