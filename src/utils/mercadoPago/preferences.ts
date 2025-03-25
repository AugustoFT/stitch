
import { preferenceClient } from './config';

// This function creates a checkout preference
export const createPreference = async (formData: any, products: any[] = [], totalAmount: number = 139.99) => {
  try {
    // Map the products to the format expected by MercadoPago
    const items = products && products.length > 0 
      ? products.map(product => ({
          id: `produto-${product.id}`,
          title: product.title,
          quantity: product.quantity,
          currency_id: 'BRL',
          unit_price: typeof product.price === 'number' ? product.price : 
                     typeof product.price === 'string' ? parseFloat(product.price.replace('R$ ', '').replace(',', '.')) : 
                     139.99
        }))
      : [
          {
            id: 'pelucia-stitch',
            title: 'Pelúcia Stitch',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 139.99
          }
        ];

    // Create the preference structure
    const preferenceData = {
      items: items,
      payer: {
        name: formData.nome,
        email: formData.email,
        phone: {
          area_code: formData.telefone.substring(0, 2),
          number: formData.telefone.substring(2).replace(/\D/g, '')
        },
        address: {
          street_name: formData.endereco,
          street_number: '',
          zip_code: formData.cep.replace(/\D/g, '')
        }
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      back_urls: {
        success: window.location.origin,
        failure: window.location.origin,
        pending: window.location.origin
      },
      auto_return: 'approved'
    };

    console.log('Creating preference with data:', preferenceData);
    
    // Create the preference using MercadoPago
    const response = await preferenceClient.create({ body: preferenceData });
    
    return {
      id: response.id,
      init_point: response.init_point
    };
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Falha ao processar o pagamento. Por favor, tente novamente.');
  }
};
