
import { createPixPaymentRequest } from './api';

// Função para criar um pagamento PIX
export const createPixPayment = async (formData: any, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  try {
    console.log('Criando pagamento PIX no valor de:', amount, 'e descrição:', description);
    
    // Validar dados do formulário
    if (!formData.nome || !formData.email || !formData.cpf) {
      console.error('Dados obrigatórios ausentes para pagamento PIX');
      return {
        status: 'error',
        message: 'Dados incompletos. Por favor, preencha todos os campos obrigatórios.'
      };
    }
    
    // Extrair nome e sobrenome
    const fullName = formData.nome.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Preparar dados para API
    const pixPaymentData = {
      transactionAmount: amount,
      description: description,
      payer: {
        email: formData.email,
        firstName: firstName,
        lastName: lastName || firstName, // Mercado Pago requer lastName
        identification: {
          type: 'CPF',
          number: formData.cpf.replace(/\D/g, '')
        }
      }
    };
    
    // Enviar dados para API
    try {
      const paymentResponse = await createPixPaymentRequest(pixPaymentData);
      
      console.log('Resposta do pagamento PIX:', paymentResponse);
      
      return {
        id: paymentResponse.id.toString(), // Convert id to string explicitly
        status: paymentResponse.status,
        qr_code: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: paymentResponse.point_of_interaction?.transaction_data?.ticket_url,
        message: 'Pagamento PIX gerado com sucesso. Escaneie o QR code para pagar.'
      };
    } catch (apiError: any) {
      console.error('Erro ao processar pagamento PIX na API:', apiError);
      return {
        status: 'error',
        message: apiError.message || 'Erro ao gerar pagamento PIX. Tente novamente.'
      };
    }
    
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    return {
      status: 'error',
      message: 'Falha ao gerar pagamento PIX. Por favor, tente novamente.'
    };
  }
};

// Para facilitar testes durante o desenvolvimento, adicionamos uma versão de fallback
// que pode ser usada quando a API backend não estiver disponível
export const createPixPaymentOffline = async (formData: any, amount: number = 139.99, description: string = 'Pelúcia Stitch') => {
  console.log('MODO DESENVOLVIMENTO: Criando pagamento PIX offline (sem API)');
  
  // Simula network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // QR Code de exemplo para testes (base64)
  const sampleQrCodeBase64 = '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';
  
  // Simular resposta
  return {
    id: 'offline_' + Math.random().toString(36).substring(2, 15),
    status: 'pending',
    qr_code: '00020101021226790014br.gov.bcb.pix2557brcode.stitch.com.br/pix/v2/11111111-2222-3333-4444-555555555555520400005303986540510.005802BR5913Pelucia Stitch6008Sao Paulo62070503***63041234',
    qr_code_base64: sampleQrCodeBase64,
    ticket_url: 'https://www.mercadopago.com.br/payments/123456789/ticket',
    message: 'Pagamento PIX gerado com sucesso. Escaneie o QR code para pagar.'
  };
};

