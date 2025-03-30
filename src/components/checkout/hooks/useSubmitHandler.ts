
import { validateCheckoutForm } from "../utils/formValidation";

interface UseSubmitHandlerProps {
  formState: any;
  saveCustomerInfo: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useSubmitHandler = ({ 
  formState, 
  saveCustomerInfo, 
  handleSubmit 
}: UseSubmitHandlerProps) => {
  
  const enhancedHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track lead event when form is submitted
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Checkout Form',
        value: formState.calculatedTotal,
        currency: 'BRL'
      });
    }
    
    // Validate form data
    const isFormValid = validateCheckoutForm(formState.formData);
    
    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'finalizar_compra',
        products: formState.productsWithQuantity.map((p: any) => ({
          id: p.id,
          name: p.title,
          price: parseFloat(String(p.price).replace('R$ ', '').replace(',', '.')),
          quantity: p.quantity
        })),
        total: formState.calculatedTotal,
        paymentMethod: formState.formData.formaPagamento,
        isFormValid
      });
    }
    
    saveCustomerInfo();
    handleSubmit(e);
  };

  return { enhancedHandleSubmit };
};
