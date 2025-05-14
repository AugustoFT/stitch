
import React, { useCallback, useRef, useEffect } from 'react';
import { useInputMask } from '@/hooks/useInputMask';

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
  // Usar máscaras IMask para os campos do cartão
  const { inputRef: cardNumberRef, getMaskedValue: getCardNumber } = useInputMask('card', {
    onComplete: (value) => {
      setCardNumber(value);
      validateField('cardNumber', value);
    }
  });
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const { inputRef: expiryRef, getMaskedValue: getExpiry } = useInputMask('expiry', {
    onComplete: (value) => {
      setExpirationDate(value);
      validateField('expirationDate', value);
    }
  });
  
  const { inputRef: cvvRef, getMaskedValue: getCvv } = useInputMask('cvv', {
    onComplete: (value) => {
      setSecurityCode(value);
      validateField('securityCode', value);
    }
  });
  
  // Para o nome do titular, usamos uma abordagem mais simples sem máscara
  const handleCardholderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCardholderName(value);
    validateField('cardholderName', value);
  }, [setCardholderName, validateField]);
  
  // Performance tracking for name field
  const perfMarkRef = useRef<string | null>(null);
  
  const startNameMeasurement = useCallback(() => {
    perfMarkRef.current = `name-input-${Date.now()}`;
    performance.mark(perfMarkRef.current);
  }, []);
  
  const endNameMeasurement = useCallback(() => {
    if (perfMarkRef.current) {
      const measureName = `${perfMarkRef.current}-duration`;
      performance.measure(measureName, perfMarkRef.current);
      const entries = performance.getEntriesByName(measureName);
      
      if (entries.length > 0) {
        const duration = entries[0].duration;
        if (duration > 10) {
          console.warn(`Name input performance warning: ${duration.toFixed(2)}ms latency`);
        }
      }
      
      performance.clearMarks(perfMarkRef.current);
      performance.clearMeasures(measureName);
      perfMarkRef.current = null;
    }
  }, []);

  return (
    <>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número do Cartão*
        </label>
        <input
          ref={cardNumberRef}
          type="text"
          id="cardNumber"
          name="cardNumber"
          defaultValue={cardNumber}
          className={`stitch-input ${errors.cardNumber ? 'border-red-500' : ''}`}
          placeholder="0000 0000 0000 0000"
          inputMode="numeric"
          autoComplete="cc-number"
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
          ref={nameInputRef}
          type="text"
          id="cardholderName"
          name="cardholderName"
          defaultValue={cardholderName}
          onChange={handleCardholderNameChange}
          onKeyDown={startNameMeasurement}
          onInput={endNameMeasurement}
          className={`stitch-input ${errors.cardholderName ? 'border-red-500' : ''}`}
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          autoComplete="cc-name"
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
            ref={expiryRef}
            type="text"
            id="expirationDate"
            name="expirationDate"
            defaultValue={expirationDate}
            className={`stitch-input ${errors.expirationDate ? 'border-red-500' : ''}`}
            placeholder="MM/AA"
            inputMode="numeric"
            autoComplete="cc-exp"
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
            ref={cvvRef}
            type="text"
            id="securityCode"
            name="securityCode"
            defaultValue={securityCode}
            className={`stitch-input ${errors.securityCode ? 'border-red-500' : ''}`}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
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
