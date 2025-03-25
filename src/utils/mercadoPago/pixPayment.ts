import { createPixPaymentRequest, simulatePixPaymentResponse } from './api';
import { isDevelopmentEnvironment } from './environment';

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
      let paymentResponse;
      
      // Se estivermos em desenvolvimento e não houver conexão com o backend, use a simulação
      if (isDevelopmentEnvironment()) {
        try {
          paymentResponse = await createPixPaymentRequest(pixPaymentData);
        } catch (connError) {
          console.warn('Usando modo de simulação para PIX devido a erro de conexão:', connError);
          paymentResponse = simulatePixPaymentResponse(pixPaymentData);
        }
      } else {
        paymentResponse = await createPixPaymentRequest(pixPaymentData);
      }
      
      console.log('Resposta do pagamento PIX:', paymentResponse);
      
      return {
        id: paymentResponse.id,
        status: paymentResponse.status,
        qr_code: paymentResponse.qr_code || paymentResponse.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentResponse.qr_code_base64 || paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: paymentResponse.ticket_url || paymentResponse.point_of_interaction?.transaction_data?.ticket_url,
        message: 'Pagamento PIX gerado com sucesso. Escaneie o QR code para pagar.'
      };
    } catch (apiError: any) {
      console.error('Erro ao processar pagamento PIX no backend:', apiError);
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
