
// Simple validation function to check if the form is filled out properly
export const validateCheckoutForm = (formData: any) => {
  const requiredFields = ['nome', 'email', 'telefone', 'cpf', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado', 'formaPagamento'];
  return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
};
