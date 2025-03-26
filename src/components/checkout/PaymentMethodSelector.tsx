
import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  formaPagamento: string;
  onChange: (formaPagamento: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  formaPagamento, 
  onChange 
}) => {
  // Force card payment method if another method was previously selected
  React.useEffect(() => {
    if (formaPagamento !== 'cartao') {
      onChange('cartao');
    }
  }, [formaPagamento, onChange]);

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Forma de Pagamento*
      </label>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div 
          className="flex items-center gap-2 p-3 rounded-lg border border-stitch-blue bg-stitch-blue/10 cursor-pointer"
        >
          <input 
            type="radio" 
            id="cartao" 
            name="formaPagamento" 
            value="cartao"
            checked={true}
            onChange={() => {}} // No need for onChange as it's the only option
            className="sr-only"
          />
          <CreditCard className="h-5 w-5 text-stitch-blue" />
          <label htmlFor="cartao" className="cursor-pointer font-medium">Cartão</label>
          
          {/* Credit card logos */}
          <div className="ml-auto flex space-x-1">
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" 
              alt="Visa" 
              className="h-6 w-auto"
            />
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" 
              alt="Mastercard" 
              className="h-6 w-auto"
            />
            <img 
              src="https://logospng.org/download/american-express/logo-american-express-icon-1024.png" 
              alt="American Express" 
              className="h-6 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
