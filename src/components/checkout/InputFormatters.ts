
// Utility functions for formatting form inputs

// Format CPF (Brazilian individual taxpayer ID)
export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length > 3) {
    formatted = cleaned.slice(0, 3) + '.' + formatted.slice(3);
  }
  if (cleaned.length > 6) {
    formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
  }
  if (cleaned.length > 9) {
    formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
  }
  
  return formatted.slice(0, 14); // 000.000.000-00 format
};

// Format phone number (Brazilian format)
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length > 2) {
    formatted = '(' + cleaned.slice(0, 2) + ') ' + formatted.slice(2);
  }
  if (cleaned.length > 7) {
    formatted = formatted.slice(0, 10) + '-' + formatted.slice(10);
  }
  
  return formatted.slice(0, 16); // (00) 00000-0000 format
};

// Format CEP (Brazilian postal code)
export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length > 5) {
    formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5);
  }
  
  return formatted.slice(0, 9); // 00000-000 format
};
