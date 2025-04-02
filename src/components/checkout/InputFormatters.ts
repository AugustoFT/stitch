
// Utility functions for formatting form inputs - Highly optimized for performance

// Memoization cache for better performance
const formatCache: Record<string, Record<string, string>> = {
  cpf: {},
  phone: {},
  cep: {}
};

// Format CPF (Brazilian individual taxpayer ID)
export const formatCPF = (value: string): string => {
  // Check cache first for better performance
  if (formatCache.cpf[value]) {
    return formatCache.cpf[value];
  }
  
  // Strip non-digits and limit to 11 digits
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const len = digits.length;
  
  // Early return for empty value
  if (len === 0) return '';
  
  let result = '';
  // Fast path checks for common cases
  if (len <= 3) {
    result = digits;
  } else if (len <= 6) {
    result = `${digits.slice(0, 3)}.${digits.slice(3)}`;
  } else if (len <= 9) {
    result = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else {
    // Full format with max 11 digits
    result = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
  
  // Cache the result
  formatCache.cpf[value] = result;
  return result;
};

// Format phone number (Brazilian format)
export const formatPhoneNumber = (value: string): string => {
  // Check cache first for better performance
  if (formatCache.phone[value]) {
    return formatCache.phone[value];
  }
  
  // Strip non-digits and limit to 11 digits
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const len = digits.length;
  
  // Early return for empty value
  if (len === 0) return '';
  
  let result = '';
  // Fast path checks for common cases
  if (len <= 2) {
    result = digits;
  } else if (len <= 7) {
    result = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else {
    // Full format with max 11 digits
    result = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
  
  // Cache the result
  formatCache.phone[value] = result;
  return result;
};

// Format CEP (Brazilian postal code)
export const formatCEP = (value: string): string => {
  // Check cache first for better performance
  if (formatCache.cep[value]) {
    return formatCache.cep[value];
  }
  
  // Strip non-digits and limit to 8 digits
  const digits = value.replace(/\D/g, '').slice(0, 8);
  
  // Early return for empty value
  if (digits.length === 0) return '';
  
  let result = '';
  // Fast path check
  if (digits.length <= 5) {
    result = digits;
  } else {
    // Full format with max 8 digits
    result = `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }
  
  // Cache the result
  formatCache.cep[value] = result;
  return result;
};

// Clear cache to prevent memory leaks in long sessions
export const clearFormatCache = () => {
  formatCache.cpf = {};
  formatCache.phone = {};
  formatCache.cep = {};
};
