
import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface OrderSummaryProps {
  products: Product[];
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ products, totalAmount }) => {
  return (
    <motion.div 
      className="bg-blue-50 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-medium text-stitch-blue mb-3 text-sm">Resumo do pedido</h3>
      
      <div className="max-h-48 overflow-y-auto mb-3 sm:max-h-60">
        {products.map((product) => (
          <div key={product.id} className="flex items-center py-2 border-b border-blue-100 last:border-b-0">
            <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0 mr-3 bg-white p-1 sm:h-12 sm:w-12">
              <img src={product.imageUrl} alt={product.title} className="h-full w-full object-contain" />
            </div>
            
            <div className="flex-grow">
              <p className="text-xs font-medium text-gray-800 sm:text-sm">{product.title}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 sm:text-sm">
                  {product.quantity} × R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs font-medium text-stitch-blue sm:text-sm">
                  R$ {(product.quantity * product.price).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center border-t border-blue-200 pt-2 font-medium">
        <span className="text-sm text-gray-800 sm:text-base">Total:</span>
        <motion.span 
          key={totalAmount}
          className="text-sm text-stitch-blue sm:text-base"
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          R$ {totalAmount.toFixed(2).replace('.', ',')}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
