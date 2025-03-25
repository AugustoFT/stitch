
import React, { useEffect } from 'react';

interface InstallmentSelectorProps {
  installments: number;
  setInstallments: (value: number) => void;
  totalAmount: number;
}

const InstallmentSelector: React.FC<InstallmentSelectorProps> = ({
  installments,
  setInstallments,
  totalAmount
}) => {
  // Update installments if selection would be invalid with new total
  useEffect(() => {
    // Ensure selected installment is valid for the current total amount
    if (installments > 1 && totalAmount < 10) {
      // If total is too low for installments, reset to 1x
      setInstallments(1);
    }
  }, [totalAmount, installments, setInstallments]);

  // Generate installment options dynamically based on current total amount
  const generateInstallmentOptions = () => {
    const options = [];
    const maxInstallments = totalAmount < 10 ? 1 : 6; // Limit installments for very low amounts
    
    for(let i = 1; i <= maxInstallments; i++) {
      const installmentValue = totalAmount / i;
      options.push(
        <option key={i} value={i}>
          {i}x de R$ {installmentValue.toFixed(2).replace('.', ',')} sem juros
        </option>
      );
    }
    
    return options;
  };

  return (
    <div>
      <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-1">
        Parcelamento*
      </label>
      <select
        id="installments"
        value={installments}
        onChange={(e) => setInstallments(parseInt(e.target.value))}
        className="stitch-input"
        required
      >
        {generateInstallmentOptions()}
      </select>
    </div>
  );
};

export default InstallmentSelector;
