
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ProductInfo {
  id: number;
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  imageUrl: string;
  size: string;
  discount: string;
  additionalInfo?: string;
  quantity: number;
}

export const useProductSelection = (initialProducts: ProductInfo[]) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([0]);
  const [productsWithQuantity, setProductsWithQuantity] = useState<ProductInfo[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Effect to update selected products and recalculate total when selection changes
  useEffect(() => {
    const selectedProducts = initialProducts
      .filter(product => selectedProductIds.includes(product.id))
      .map(product => ({...product}));
    
    setProductsWithQuantity(selectedProducts);
    
    const total = selectedProducts.reduce((sum, product) => {
      // Garantir que o preço seja tratado como string e convertido corretamente
      const priceStr = typeof product.price === 'string' 
        ? product.price 
        : String(product.price);
      
      const price = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
      return sum + (price * product.quantity);
    }, 0);
    
    setTotalAmount(total);
  }, [selectedProductIds, initialProducts]);

  // Effect to update total when quantity changes
  useEffect(() => {
    if (productsWithQuantity.length > 0) {
      const total = productsWithQuantity.reduce((sum, product) => {
        // Garantir que o preço seja tratado como string e convertido corretamente
        const priceStr = typeof product.price === 'string' 
          ? product.price 
          : String(product.price);
        
        const price = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
        return sum + (price * product.quantity);
      }, 0);
      
      setTotalAmount(total);
    }
  }, [productsWithQuantity]);

  const toggleProductSelection = (productId: number, selected: boolean) => {
    if (selected) {
      setSelectedProductIds(prev => {
        if (!prev.includes(productId)) {
          toast.success("Produto adicionado ao carrinho!");
          return [...prev, productId];
        }
        return prev;
      });
    } else {
      setSelectedProductIds(prev => {
        const newSelection = prev.filter(id => id !== productId);
        if (newSelection.length !== prev.length) {
          toast.info("Produto removido do carrinho");
        }
        return newSelection;
      });
    }
  };
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    setProductsWithQuantity(prev => {
      // First check if the product already exists in the array
      const existingProductIndex = prev.findIndex(p => p.id === productId);
      
      if (existingProductIndex >= 0) {
        // If it exists, update the quantity
        const updatedProducts = prev.map(product => 
          product.id === productId ? { ...product, quantity } : product
        );
        
        return updatedProducts;
      } else {
        // If it doesn't exist, don't do anything (the product must be selected first)
        return prev;
      }
    });
  };
  
  const handleRemoveProduct = (productId: number) => {
    // Remove the product from the list of selected
    toggleProductSelection(productId, false);
  };

  return {
    selectedProductIds,
    productsWithQuantity,
    totalAmount,
    toggleProductSelection,
    handleQuantityChange,
    handleRemoveProduct
  };
};
