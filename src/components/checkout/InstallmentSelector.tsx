
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
        <option value={1}>1x de R$ {(totalAmount).toFixed(2).replace('.', ',')} sem juros</option>
        <option value={2}>2x de R$ {(totalAmount / 2).toFixed(2).replace('.', ',')} sem juros</option>
        <option value={3}>3x de R$ {(totalAmount / 3).toFixed(2).replace('.', ',')} sem juros</option>
        <option value={6}>6x de R$ {(totalAmount / 6).toFixed(2).replace('.', ',')} sem juros</option>
        <option value={12}>12x de R$ {(totalAmount / 12).toFixed(2).replace('.', ',')} sem juros</option>
      </select>
    </div>
  );
};

export default InstallmentSelector;
