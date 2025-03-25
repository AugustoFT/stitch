
import { useState, useEffect } from 'react';

interface ProductWithQuantity {
  id: number;
  title: string;
  price: number;
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
      const processedProducts = initialProducts.map(product => ({
        id: product.id,
        title: product.title,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace('R$ ', '').replace(',', '.'))
          : product.price,
        imageUrl: product.imageUrl,
        quantity: product.quantity || 1
      }));
      
      const total = processedProducts.reduce(
        (sum, product) => sum + (product.price * product.quantity), 
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
        (sum, product) => sum + (product.price * product.quantity), 
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
        (sum, product) => sum + (product.price * product.quantity), 
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
