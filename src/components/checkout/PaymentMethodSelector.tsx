
import React, { useCallback } from 'react';
import { CreditCard, PiggyBank } from 'lucide-react';
import { pushToDataLayer } from '../../utils/dataLayer';

interface PaymentMethodSelectorProps {
  formaPagamento: string;
  onChange: (formaPagamento: string) => void;
}

declare global {
  interface Window {
    fbq: any;
  }
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  formaPagamento, 
  onChange 
}) => {
  const handlePaymentMethodChange = useCallback((method: string) => {
    // Track payment method selection with Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        payment_method: method
      });
    }
    
    // Push to dataLayer
    pushToDataLayer('selecionar_metodo_pagamento', {
      categoria: 'E-commerce',
      acao: 'Selecionar Método de Pagamento',
      payment_method: method
    });
    
    onChange(method);
  }, [onChange]);

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Forma de Pagamento*
      </label>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formaPagamento === 'cartao' ? 'border-stitch-blue bg-stitch-blue/10' : 'border-gray-300 hover:bg-gray-50'}`}
          onClick={() => handlePaymentMethodChange('cartao')}
        >
          <input 
            type="radio" 
            id="cartao" 
            name="formaPagamento" 
            value="cartao"
            checked={formaPagamento === 'cartao'}
            onChange={() => handlePaymentMethodChange('cartao')}
            className="sr-only"
          />
          <CreditCard className={`h-5 w-5 ${formaPagamento === 'cartao' ? 'text-stitch-blue' : 'text-gray-500'}`} />
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
        
        {/* Opção de PIX */}
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formaPagamento === 'pix' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
          onClick={() => handlePaymentMethodChange('pix')}
        >
          <input 
            type="radio" 
            id="pix" 
            name="formaPagamento" 
            value="pix"
            checked={formaPagamento === 'pix'}
            onChange={() => handlePaymentMethodChange('pix')}
            className="sr-only"
          />
          <PiggyBank className={`h-5 w-5 ${formaPagamento === 'pix' ? 'text-green-500' : 'text-gray-500'}`} />
          <label htmlFor="pix" className="cursor-pointer font-medium">PIX</label>
          
          {/* PIX logo */}
          <div className="ml-auto">
            <img 
              src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo-1.png" 
              alt="PIX" 
              className="h-5 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaymentMethodSelector);
