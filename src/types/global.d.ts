
// Global type definitions
interface Window {
  MercadoPago: any;
  process?: {
    env: Record<string, string>;
    version?: string;
    platform?: string;
    release?: {
      name?: string;
    };
    versions?: {
      node?: string;
    };
  };
}
