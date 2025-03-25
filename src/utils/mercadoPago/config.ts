
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Chave pública para uso no frontend - segura para expor
export const mercadoPagoPublicKey = 'APP_USR-46646251-3224-483c-b69d-85c5f8c96428';

// Configuração do cliente Mercado Pago
export const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-6405882494224029-030315-88737fea58568b8cc6d16c0be760c632-1082540248'
});

// Clientes instanciados para uso direto
export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

// Interface estendida para incluir point_of_interaction
export interface ExtendedPreferenceResponse {
  id: string;
  init_point: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
    }
  }
}

// Inicializar MercadoPago no frontend
export const initMercadoPago = () => {
  console.log('MercadoPago inicializado com chave pública:', mercadoPagoPublicKey);
  return mercadoPagoPublicKey;
};

// Função auxiliar para determinar o tipo de cartão
export function determineCardType(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^(5[1-5])/.test(cleanNumber)) return 'master';
  if (/^(34|37)/.test(cleanNumber)) return 'amex';
  if (/^(60|65|6[8-9])/.test(cleanNumber)) return 'elo'; 
  if (/^(36|38|30[0-5])/.test(cleanNumber)) return 'diners';
  if (/^(606282|3841|603493|637095|637599|637609|637612)/.test(cleanNumber)) return 'hipercard';
  if (/^50[0-9]/.test(cleanNumber)) return 'aura';
  if (/^(2131|1800|35)/.test(cleanNumber)) return 'jcb';
  if (/^(6011|622|64|65)/.test(cleanNumber)) return 'discover';
  
  return 'visa';
}

// Função auxiliar para obter mensagem legível para status de pagamento
export function getPaymentStatusMessage(status: string): string {
  switch (status) {
    case 'approved':
      return 'Pagamento aprovado com sucesso!';
    case 'in_process':
    case 'pending':
      return 'Pagamento em processamento. Aguarde a confirmação.';
    case 'rejected':
      return 'Pagamento rejeitado. Verifique os dados do cartão.';
    default:
      return `Status do pagamento: ${status}`;
  }
}

// URL base da API - produção vs desenvolvimento
const PROD_API_URL = 'https://api.mercadopago.com';
const DEV_API_URL = 'https://api.mercadopago.com';

// Definição da URL da API com base no ambiente
export const API_BASE_URL = window.location.hostname === 'localhost' ? DEV_API_URL : PROD_API_URL;
