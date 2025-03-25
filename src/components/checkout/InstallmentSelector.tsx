
import React from 'react';

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
  // Generate installment options dynamically
  const generateInstallmentOptions = () => {
    const options = [];
    
    for(let i = 1; i <= 6; i++) {
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
