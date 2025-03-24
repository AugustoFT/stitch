
// Format credit card number with spaces after every 4 digits
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formatted = '';
  
  for (let i = 0; i < cleaned.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += ' ';
    }
    formatted += cleaned[i];
  }
  
  return formatted.slice(0, 19); // 16 digits + 3 spaces
};

// Format expiration date as MM/YY
export const formatExpirationDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length > 2) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  
  return formatted.slice(0, 5); // MM/YY format
};

// Format CVV as a 3-4 digit number
export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

// Validate credit card field
export const validateCardField = (field: string, value: string): string | null => {
  switch (field) {
    case 'cardNumber':
      if (!value) {
        return 'Número do cartão é obrigatório';
      } else if (value.replace(/\s/g, '').length < 16) {
        return 'Número do cartão inválido';
      }
      break;
      
    case 'cardholderName':
      if (!value) {
        return 'Nome no cartão é obrigatório';
      } else if (value.length < 3) {
        return 'Nome muito curto';
      }
      break;
      
    case 'expirationDate':
      if (!value) {
        return 'Data de validade é obrigatória';
      } else if (value.length < 5) {
        return 'Data incompleta';
      } else {
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          return 'Mês inválido';
        } else if (parseInt(year) < currentYear || 
                  (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          return 'Cartão expirado';
        }
      }
      break;
      
    case 'securityCode':
      if (!value) {
        return 'CVV é obrigatório';
      } else if (value.length < 3) {
        return 'CVV inválido';
      }
      break;
  }
  
  return null;
};
