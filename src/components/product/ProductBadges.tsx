
import React, { memo } from 'react';
import { Award, TruckIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ProductBadgesProps {
  discount: string;
  title: string;
  hasFreeShipping: boolean;
}

const ProductBadges: React.FC<ProductBadgesProps> = memo(({ discount, title, hasFreeShipping }) => {
  return (
    <>
      <div className="absolute top-2 right-2 bg-stitch-pink text-white text-xs font-bold py-1 px-2 rounded-full">
        {discount}
      </div>
      
      <div className="absolute top-2 left-2 bg-stitch-yellow text-stitch-dark text-xs font-bold py-1 px-2 rounded-full">
        Edição Limitada
      </div>
      
      {/* Free shipping badge */}
      {hasFreeShipping && (
        <div className="bg-green-100 text-green-800 text-xs p-1.5 mb-2 rounded flex items-center">
          <TruckIcon className="w-3 h-3 mr-1" />
          Frete Grátis
        </div>
      )}
      
      {/* Guarantee banner */}
      <div className="bg-gray-100 p-2 rounded-md text-center text-xs text-gray-700 flex items-center justify-center">
        <Award className="w-3 h-3 mr-1 text-stitch-blue" />
        Garantia de 30 dias
      </div>
    </>
  );
});

ProductBadges.displayName = 'ProductBadges';

export default ProductBadges;
