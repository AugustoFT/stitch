
import { useState, useEffect } from 'react';

interface ProductWithQuantity {
  id: number;
  title: string;
  price: number | string;
  imageUrl: string;
  quantity: number;
}

export const useCart = (initialProducts: any[] = [], initialTotalAmount: number = 139.99) => {
  const [productsWithQuantity, setProductsWithQuantity] = useState<ProductWithQuantity[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(initialTotalAmount);

  // Effect to process and update products when they change
  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      return;
    }
    
    try {
      const processedProducts = initialProducts.map(product => {
        // Garantir que o preço seja convertido para número corretamente
        let priceValue: number;
        
        if (typeof product.price === 'string') {
          // Remove "R$ " e substitui vírgula por ponto para converter para número
          priceValue = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        } else if (typeof product.price === 'number') {
          priceValue = product.price;
        } else {
          console.warn('Formato de preço inesperado:', product.price);
          priceValue = 0;
        }
        
        return {
          id: product.id,
          title: product.title,
          price: priceValue,
          imageUrl: product.imageUrl,
          quantity: product.quantity || 1
        };
      });
      
      const total = processedProducts.reduce(
        (sum, product) => sum + (typeof product.price === 'number' ? product.price * product.quantity : 0), 
        0
      );
      
      setProductsWithQuantity(processedProducts);
      setCalculatedTotal(total);
      
    } catch (error) {
      console.error('Error processing products:', error);
    }
  }, [initialProducts]);

  // Update a product's quantity
  const updateProductQuantity = (productId: number, quantity: number) => {
    setProductsWithQuantity(prev => {
      const updatedProducts = prev.map(product => 
        product.id === productId ? { ...product, quantity } : product
      );
      
      const newTotal = updatedProducts.reduce(
        (sum, product) => {
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price.replace('R$ ', '').replace(',', '.'))
            : product.price;
          return sum + (price * product.quantity);
        }, 
        0
      );
      
      setCalculatedTotal(newTotal);
      return updatedProducts;
    });
  };

  // Remove a product
  const removeProduct = (productId: number) => {
    setProductsWithQuantity(prev => {
      const updatedProducts = prev.filter(
        product => product.id !== productId
      );
      
      const newTotal = updatedProducts.reduce(
        (sum, product) => {
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price.replace('R$ ', '').replace(',', '.'))
            : product.price;
          return sum + (price * product.quantity);
        }, 
        0
      );
      
      setCalculatedTotal(newTotal);
      return updatedProducts;
    });
  };

  return {
    productsWithQuantity,
    calculatedTotal,
    updateProductQuantity,
    removeProduct
  };
};
