
/**
 * Initialize the dataLayer if it doesn't exist yet
 */
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * Push an event to the dataLayer
 */
export const pushToDataLayer = (event: string, data: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data
    });
    console.log('Evento disparado:', event, data);
  }
};

/**
 * Specific event tracking functions for common actions
 */
export const eventTrackers = {
  comprarAgora: (location: string) => {
    pushToDataLayer('comprarAgora', {
      categoria: 'E-commerce',
      acao: 'Clique no Comprar Agora',
      buttonLocation: location
    });
  },
  
  finalizarPedido: (products: any[], total: number) => {
    pushToDataLayer('finalizarPedido', {
      categoria: 'E-commerce',
      acao: 'Finalizar Pedido',
      products: products.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        quantity: p.quantity
      })),
      total
    });
  },
  
  fecharPedido: (isFormValid: boolean) => {
    pushToDataLayer('fecharPedido', {
      categoria: 'E-commerce',
      acao: 'Fechar Pedido',
      isFormValid
    });
  },
  
  finalizarCompra: (products: any[], total: number, paymentMethod: string, orderId: string) => {
    pushToDataLayer('finalizarCompra', {
      categoria: 'E-commerce',
      acao: 'Compra Finalizada',
      products: products.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        quantity: p.quantity
      })),
      total,
      paymentMethod,
      orderId
    });
  },
  
  gerarQrCodePix: () => {
    pushToDataLayer('gerarQrCodePix', {
      categoria: 'E-commerce',
      acao: 'Gerar QR Code PIX',
      payment_method: 'pix'
    });
  },
  
  addToCart: (product: any) => {
    pushToDataLayer('adicionarAoCarrinho', {
      categoria: 'E-commerce',
      acao: 'Adicionar ao Carrinho',
      productId: product.id,
      productName: product.title,
      productPrice: product.price
    });
  },
  
  removeFromCart: (product: any) => {
    pushToDataLayer('removerDoCarrinho', {
      categoria: 'E-commerce',
      acao: 'Remover do Carrinho',
      productId: product.id,
      productName: product.title,
      productPrice: product.price
    });
  }
};
