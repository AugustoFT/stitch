
// Utility functions for formatting form inputs - Optimized for performance

// Format CPF (Brazilian individual taxpayer ID)
export const formatCPF = (value: string): string => {
  // Strip non-digits and limit to 11 digits for better performance
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const len = digits.length;
  
  // Early return for empty value
  if (len === 0) return '';
  
  // Fast path checks for common cases
  if (len <= 3) return digits;
  if (len <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (len <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  
  // Full format with max 11 digits
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

// Format phone number (Brazilian format)
export const formatPhoneNumber = (value: string): string => {
  // Strip non-digits and limit to 11 digits for better performance
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const len = digits.length;
  
  // Early return for empty value
  if (len === 0) return '';
  
  // Fast path checks for common cases
  if (len <= 2) return digits;
  if (len <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  
  // Full format with max 11 digits
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

// Format CEP (Brazilian postal code)
export const formatCEP = (value: string): string => {
  // Strip non-digits and limit to 8 digits for better performance
  const digits = value.replace(/\D/g, '').slice(0, 8);
  
  // Early return for empty value
  if (digits.length === 0) return '';
  
  // Fast path check
  if (digits.length <= 5) return digits;
  
  // Full format with max 8 digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};
