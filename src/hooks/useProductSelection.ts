
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ProductInfo {
  id: number;
  title: string;
  price: string | number;
  originalPrice?: string;
  description?: string;
  imageUrl: string;
  size?: string;
  discount?: string;
  additionalInfo?: string;
  quantity: number;
}

export const useProductSelection = (initialProducts: ProductInfo[]) => {
  // Iniciar com o ID 2 (Kit Completo Stitch) selecionado por padrão
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([2]);
  const [productsWithQuantity, setProductsWithQuantity] = useState<ProductInfo[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Effect to update selected products and recalculate total when selection changes
  useEffect(() => {
    const selectedProducts = initialProducts
      .filter(product => selectedProductIds.includes(product.id))
      .map(product => ({...product, quantity: product.quantity || 1}));
    
    setProductsWithQuantity(selectedProducts);
    
    const total = selectedProducts.reduce((sum, product) => {
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
    setProductsWithQuantity(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };
  
  const handleRemoveProduct = (productId: number) => {
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
