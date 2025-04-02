
// Utility functions for formatting form inputs

// Format CPF (Brazilian individual taxpayer ID)
export const formatCPF = (value: string): string => {
  // Limpar qualquer caractere que não seja número
  const cleaned = value.replace(/\D/g, '');
  
  // Aplicar a formatação apenas se necessário
  if (cleaned.length <= 3) return cleaned;
  
  if (cleaned.length <= 6) 
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

// Format phone number (Brazilian format)
export const formatPhoneNumber = (value: string): string => {
  // Limpar qualquer caractere que não seja número
  const cleaned = value.replace(/\D/g, '');
  
  // Aplicar formatação apenas se necessário
  if (cleaned.length <= 2) return cleaned;
  
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

// Format CEP (Brazilian postal code)
export const formatCEP = (value: string): string => {
  // Limpar qualquer caractere que não seja número
  const cleaned = value.replace(/\D/g, '');
  
  // Aplicar formatação apenas se necessário
  if (cleaned.length <= 5) return cleaned;
  
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};
