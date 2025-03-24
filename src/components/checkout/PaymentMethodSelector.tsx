
import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';

interface PaymentMethodSelectorProps {
  formaPagamento: string;
  onChange: (formaPagamento: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  formaPagamento, 
  onChange 
}) => {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Forma de Pagamento*
      </label>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
            formaPagamento === 'cartao' 
              ? 'border-stitch-blue bg-stitch-blue/10' 
              : 'border-gray-300 hover:border-stitch-blue/50'
          }`}
          onClick={() => onChange('cartao')}
        >
          <input 
            type="radio" 
            id="cartao" 
            name="formaPagamento" 
            value="cartao"
            checked={formaPagamento === 'cartao'}
            onChange={() => onChange('cartao')}
            className="sr-only"
          />
          <CreditCard className={`h-5 w-5 ${formaPagamento === 'cartao' ? 'text-stitch-blue' : 'text-gray-500'}`} />
          <label htmlFor="cartao" className="cursor-pointer font-medium">Cartão</label>
        </div>
        
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
            formaPagamento === 'pix' 
              ? 'border-stitch-blue bg-stitch-blue/10' 
              : 'border-gray-300 hover:border-stitch-blue/50'
          }`}
          onClick={() => onChange('pix')}
        >
          <input 
            type="radio" 
            id="pix" 
            name="formaPagamento" 
            value="pix"
            checked={formaPagamento === 'pix'}
            onChange={() => onChange('pix')}
            className="sr-only"
          />
          <QrCode className={`h-5 w-5 ${formaPagamento === 'pix' ? 'text-stitch-blue' : 'text-gray-500'}`} />
          <label htmlFor="pix" className="cursor-pointer font-medium">PIX</label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
