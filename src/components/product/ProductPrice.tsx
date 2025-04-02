
import React from 'react';
import { motion } from 'framer-motion';

interface ProductPriceProps {
  price: string | number;
  originalPrice?: string;
  quantity: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ 
  price, 
  originalPrice = '', 
  quantity = 1 
}) => {
  // Função segura para formatação de preço
  const formatPrice = (value: string | number): string => {
    try {
      // Se já for uma string formatada, retorna ela
      if (typeof value === 'string' && value.startsWith('R$')) {
        return value.trim();
      }
      
      // Converte para número se for string
      let numValue: number;
      if (typeof value === 'string') {
        // Remove caracteres não numéricos exceto ponto e vírgula
        const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
        numValue = parseFloat(cleanValue);
      } else {
        numValue = value;
      }
      
      // Verifica se é um número válido
      if (isNaN(numValue)) {
        console.warn('Valor de preço inválido:', value);
        return 'R$ 0,00';
      }
      
      // Formata o número como moeda brasileira
      return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
    } catch (error) {
      console.error('Erro ao formatar preço:', error);
      return 'R$ 0,00';
    }
  };
  
  // Formata o preço principal
  const formattedPrice = formatPrice(price);
  
  // Calcula o preço total com segurança
  const calculateTotal = (): string => {
    try {
      // Extrai o número do preço formatado
      let priceValue: number;
      
      if (typeof price === 'number') {
        priceValue = price;
      } else if (typeof price === 'string') {
        if (price.startsWith('R$')) {
          priceValue = parseFloat(price.replace('R$ ', '').replace(',', '.'));
        } else {
          priceValue = parseFloat(price.replace(',', '.'));
        }
      } else {
        console.warn('Tipo de preço inesperado:', typeof price);
        return formattedPrice;
      }
      
      // Calcula o total
      const total = priceValue * quantity;
      
      // Formata o total
      return formatPrice(total);
    } catch (error) {
      console.error('Erro ao calcular total:', error);
      return formattedPrice; // Fallback para o preço unitário
    }
  };
  
  const totalPrice = calculateTotal();

  return (
    <>
      <div className="flex items-center mb-2">
        <p className="text-stitch-blue font-bold">{formattedPrice}</p>
        {originalPrice && (
          <p className="text-gray-400 text-sm line-through ml-2">{originalPrice}</p>
        )}
      </div>
      
      {quantity > 1 && (
        <motion.div
          key={totalPrice}
          className="text-right font-bold text-stitch-blue"
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Total: {totalPrice}
        </motion.div>
      )}
    </>
  );
};

export default ProductPrice;
