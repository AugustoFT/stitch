
import { toast } from 'sonner';
import { createPixPaymentRequest, simulatePixPaymentResponse } from './api';
import { isDevelopmentEnvironment, forceProductionMode } from './environment';

// Função para criar pagamento PIX
export const createPixPayment = async (formData: any, amount: number = 0.05, description: string = 'Pelúcia Stitch', products?: any[]): Promise<any> => {
  try {
    console.log('Iniciando criação de pagamento PIX');
    console.log('MODO DE PRODUÇÃO ATIVO!');
    
    if (!formData.nome || !formData.email || !formData.cpf) {
      console.error('Dados do formulário incompletos');
      throw new Error('Por favor, preencha todos os campos obrigatórios');
    }
    
    // Extrair primeiro e último nome
    const fullName = formData.nome || '';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    
    // Limpar CPF (remover caracteres não numéricos)
    const cleanCpf = (formData.cpf || '').replace(/\D/g, '');
    
    // Criar dados para o pagamento PIX
    const paymentData = {
      transactionAmount: amount,
      description: description,
      payer: {
        email: formData.email,
        firstName: firstName,
        lastName: lastName,
        identification: {
          type: 'CPF',
          number: cleanCpf
        }
      }
    };

    // Processar pagamento PIX via API do MercadoPago
    console.log('Processando pagamento PIX em ambiente de PRODUÇÃO');
    const paymentResult = await createPixPaymentRequest(paymentData);
    
    // Extrair dados e normalizar a estrutura
    const qrCode = paymentResult.qr_code || (paymentResult.point_of_interaction?.transaction_data?.qr_code);
    const qrCodeBase64 = paymentResult.qr_code_base64 || (paymentResult.point_of_interaction?.transaction_data?.qr_code_base64);
    const ticketUrl = paymentResult.ticket_url || (paymentResult.point_of_interaction?.transaction_data?.ticket_url);
    
    console.log('PIX gerado com sucesso:', {
      id: paymentResult.id,
      status: paymentResult.status,
      qr_code: qrCode ? 'presente' : 'ausente',
      qr_code_base64: qrCodeBase64 ? 'presente' : 'ausente',
      ticket_url: ticketUrl
    });
    
    // Resultado normalizado
    return {
      id: paymentResult.id,
      status: paymentResult.status,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      ticket_url: ticketUrl
    };
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw new Error(error.message || 'Falha ao criar pagamento PIX');
  }
};

// Exportando a função de verificação de status
export const checkPixStatus = async (pixId: string): Promise<string> => {
  try {
    // Em um ambiente real, isso consultaria o status no backend
    console.log('Verificando status do PIX ID:', pixId);
    
    // No modo de produção, sempre retorna pendente para testar
    return 'pending';
  } catch (error) {
    console.error('Erro ao verificar status do PIX:', error);
    throw new Error('Falha ao verificar status do pagamento');
  }
};
