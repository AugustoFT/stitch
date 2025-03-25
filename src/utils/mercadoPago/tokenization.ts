
// Handle the card tokenization process
export const handleCardTokenization = async (mp: any, cardData: any, formData: any) => {
  // Extract month and year from expiration date (MM/YY)
  const [expMonth, expYear] = cardData.expirationDate.split('/');
  
  // Format CPF correctly
  const cpf = formData.cpf.replace(/\D/g, '');
  
  // Prepare card token data
  const cardTokenData = {
    cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
    cardholderName: cardData.cardholderName,
    cardExpirationMonth: expMonth,
    cardExpirationYear: `20${expYear}`,
    securityCode: cardData.securityCode,
    identificationType: 'CPF',
    identificationNumber: cpf
  };
  
  // Log card data securely (omitting sensitive data)
  console.log('Dados para tokenização (detalhes sensíveis omitidos):', {
    ...cardTokenData,
    cardNumber: '****' + cardTokenData.cardNumber.slice(-4),
    securityCode: '***'
  });
  
  // Tokenize the card
  return await mp.createCardToken(cardTokenData);
};
