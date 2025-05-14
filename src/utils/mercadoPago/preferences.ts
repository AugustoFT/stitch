
import { preferenceClient } from './config';
import { ProductInfo } from '../../hooks/useProductSelection';

// Define the CustomerInfo interface
interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  cep: string;
}

// This function creates a checkout preference
export const createPreference = async (
  products: ProductInfo[], 
  customerInfo: CustomerInfo
): Promise<{ id?: string, init_point?: string }> => {
  
  try {
    // Format items for MercadoPago
    const preferenceItems = products.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      quantity: product.quantity,
      currency_id: 'BRL',
      unit_price: product.price
    }));
    
    // Create preference object
    const preference = {
      items: preferenceItems,
      payer: {
        name: customerInfo.fullName,
        email: customerInfo.email,
        phone: {
          area_code: customerInfo.phone.substring(0, 2),
          number: customerInfo.phone.substring(2)
        },
        address: {
          street_name: customerInfo.address,
          // Convert street_number from string to number to fix type error
          street_number: parseInt(customerInfo.number) || 0, 
          zip_code: customerInfo.cep
        }
      },
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' }
        ],
        installments: 12
      },
      back_urls: {
        success: `${window.location.origin}?status=success`,
        failure: `${window.location.origin}?status=failure`,
        pending: `${window.location.origin}?status=pending`
      },
      auto_return: 'approved'
    };
    
    console.log('Creating preference with data:', preference);
    
    // Create the preference using MercadoPago
    const response = await preferenceClient.create({ body: preference });
    
    return {
      id: response.id,
      init_point: response.init_point
    };
  } catch (error) {
    console.error('Error creating preference:', error);
    return {};
  }
};
