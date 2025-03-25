
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_FUNCTION_URL: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  MercadoPago: any;
  process?: any;
}
