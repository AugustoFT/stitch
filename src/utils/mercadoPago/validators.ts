
// Form data validation
export const validateFormData = (formData: any) => {
  if (!formData.nome || !formData.email || !formData.cpf) {
    console.error('Dados de formulário obrigatórios ausentes para pagamento com cartão');
    return {
      status: 'error',
      status_detail: 'Missing required form data',
      message: 'Dados incompletos. Por favor, preencha todos os campos obrigatórios.'
    };
  }
  return null;
};

// Card data validation
export const validateCardData = (cardData: any) => {
  if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expirationDate || !cardData.securityCode) {
    console.error('Dados de cartão obrigatórios ausentes');
    return {
      status: 'error',
      status_detail: 'Missing required card data',
      message: 'Dados do cartão incompletos. Por favor, preencha todos os campos do cartão.'
    };
  }
  return null;
};
