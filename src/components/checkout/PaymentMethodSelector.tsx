
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
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className="h-5 w-auto"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" 
              alt="Mastercard" 
              className="h-5 w-auto"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" 
              alt="American Express" 
              className="h-5 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
