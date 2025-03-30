
import React, { useCallback } from 'react';
import { formatCardNumber, formatExpirationDate, formatCVV } from './CardFormatters';

interface CardInputsProps {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
  errors: { [key: string]: string };
  setCardNumber: (value: string) => void;
  setCardholderName: (value: string) => void;
  setExpirationDate: (value: string) => void;
  setSecurityCode: (value: string) => void;
  validateField: (field: string, value: string) => void;
}

const CardInputs: React.FC<CardInputsProps> = ({
  cardNumber,
  cardholderName,
  expirationDate,
  securityCode,
  errors,
  setCardNumber,
  setCardholderName,
  setExpirationDate,
  setSecurityCode,
  validateField
}) => {
  // Use memoized event handlers for better performance
  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    validateField('cardNumber', formattedValue);
  }, [setCardNumber, validateField]);

  const handleCardholderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCardholderName(value);
    validateField('cardholderName', value);
  }, [setCardholderName, validateField]);

  const handleExpirationDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpirationDate(e.target.value);
    setExpirationDate(formattedValue);
    validateField('expirationDate', formattedValue);
  }, [setExpirationDate, validateField]);

  const handleSecurityCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCVV(e.target.value);
    setSecurityCode(formattedValue);
    validateField('securityCode', formattedValue);
  }, [setSecurityCode, validateField]);

  return (
    <>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número do Cartão*
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={`stitch-input ${errors.cardNumber ? 'border-red-500' : ''}`}
          placeholder="0000 0000 0000 0000"
          required
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome no Cartão*
        </label>
        <input
          type="text"
          id="cardholderName"
          value={cardholderName}
          onChange={handleCardholderNameChange}
          className={`stitch-input ${errors.cardholderName ? 'border-red-500' : ''}`}
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          required
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Validade*
          </label>
          <input
            type="text"
            id="expirationDate"
            value={expirationDate}
            onChange={handleExpirationDateChange}
            className={`stitch-input ${errors.expirationDate ? 'border-red-500' : ''}`}
            placeholder="MM/AA"
            required
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-1">
            CVV*
          </label>
          <input
            type="text"
            id="securityCode"
            value={securityCode}
            onChange={handleSecurityCodeChange}
            className={`stitch-input ${errors.securityCode ? 'border-red-500' : ''}`}
            placeholder="123"
            required
          />
          {errors.securityCode && (
            <p className="text-red-500 text-xs mt-1">{errors.securityCode}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(CardInputs);
