
import { useState } from 'react';
import { validateCardField } from '../CardFormatters';

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
}

export interface CardFormErrors {
  [key: string]: string;
}

export const useCardFormValidation = () => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    securityCode: ''
  });
  const [errors, setErrors] = useState<CardFormErrors>({});
  
  const setCardField = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const validateField = (field: string, value: string) => {
    const errorMessage = validateCardField(field, value);
    
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const validateAllFields = () => {
    const cardNumberValid = validateField('cardNumber', cardData.cardNumber);
    const cardholderNameValid = validateField('cardholderName', cardData.cardholderName);
    const expirationDateValid = validateField('expirationDate', cardData.expirationDate);
    const securityCodeValid = validateField('securityCode', cardData.securityCode);
    
    return cardNumberValid && cardholderNameValid && expirationDateValid && securityCodeValid;
  };

  const loadSavedCardData = () => {
    const savedCardData = localStorage.getItem('cardFormData');
    if (savedCardData) {
      try {
        const parsedData = JSON.parse(savedCardData);
        setCardData(prev => ({
          ...prev,
          cardNumber: parsedData.cardNumber || '',
          cardholderName: parsedData.cardholderName || ''
        }));
      } catch (e) {
        console.error('Error parsing saved card data', e);
      }
    }
  };

  const saveFormData = () => {
    const dataToSave = {
      cardNumber: cardData.cardNumber,
      cardholderName: cardData.cardholderName
    };
    localStorage.setItem('cardFormData', JSON.stringify(dataToSave));
  };

  return {
    cardData,
    errors,
    setCardField,
    validateField,
    validateAllFields,
    loadSavedCardData,
    saveFormData
  };
};
