
import { useState } from 'react';
import { toast } from 'sonner';
import { processCardPayment } from '../../../utils/mercadoPago';
import { createNewOrder } from '../../../utils/orders/orderManager';

interface UseCardPaymentProps {
  formData: any;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
  selectedProducts?: any[];
  totalAmount?: number;
  mercadoPagoReady: boolean;
}

export const useCardPayment = ({
  formData,
  setIsSubmitting,
  setPaymentResult,
  setCardPaymentStatus,
  selectedProducts = [],
  totalAmount = 139.98,
  mercadoPagoReady
}: UseCardPaymentProps) => {
  const [paymentResult, setLocalPaymentResult] = useState<any>(null);
  const [cardPaymentStatus, setLocalCardPaymentStatus] = useState<string | null>(null);

  const getProductDescription = () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return 'Pelúcia Stitch';
    }
    
    if (selectedProducts.length === 1) {
      return selectedProducts[0].title;
    }
    
    return `Compra Stitch (${selectedProducts.length} itens)`;
  };

  const handleCardPayment = async (cardData: any, installments: number) => {
    if (!mercadoPagoReady) {
      toast.error("O sistema de pagamento ainda não foi carregado. Aguarde alguns segundos.");
      return;
    }
    
    if (!formData.nome || !formData.email || !formData.cpf) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    setPaymentResult(null);
    setCardPaymentStatus(null);
    
    try {
      toast.info("Processando pagamento, aguarde...");
      
      console.log('Form data:', formData);
      console.log('Total amount:', totalAmount);
      console.log('Installments:', installments);
      
      console.log('Processando pagamento em ambiente de PRODUÇÃO');
      const result = await processCardPayment(
        cardData, 
        formData, 
        installments, 
        totalAmount, 
        getProductDescription()
      );
      
      console.log('Payment result:', result);
      
      setLocalPaymentResult(result);
      setLocalCardPaymentStatus(result.status);
      
      setPaymentResult(result);
      setCardPaymentStatus(result.status);
      
      if (result.status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
        
        await createOrderAfterPayment(result);
      } else if (result.status === 'in_process' || result.status === 'pending') {
        toast.info("Pagamento em processamento. Aguarde a confirmação.");
      } else {
        toast.error(`Pagamento ${result.status}. ${result.message || 'Verifique os dados do cartão.'}`);
      }
    } catch (error: any) {
      console.error("Erro ao processar pagamento com cartão:", error);
      toast.error("Houve um erro ao processar o pagamento. Por favor, verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createOrderAfterPayment = async (result: any) => {
    const orderProducts = selectedProducts.map(product => ({
      id: product.id,
      name: product.title,
      quantity: product.quantity,
      price: parseFloat(product.price.replace('R$ ', '').replace(',', '.')),
      imageUrl: product.imageUrl
    }));
    
    const customerInfo = {
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      address: formData.endereco,
      numero: formData.numero,
      city: formData.cidade,
      state: formData.estado,
      zip: formData.cep,
      cpf: formData.cpf
    };
    
    try {
      const order = await createNewOrder(
        orderProducts,
        customerInfo,
        'credit_card',
        result.id
      );
      
      console.log('Pedido criado com sucesso:', order);
      
      const trackingCode = 'BR' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0') + 'SP';
      
      const updatedResult = {
        ...result, 
        orderId: order.id,
        tracking_code: trackingCode
      };
      
      setLocalPaymentResult(updatedResult);
      setPaymentResult(updatedResult);
      
      toast.success("Pedido registrado com sucesso!");
      toast.success(`Código de rastreio gerado: ${trackingCode}`);
    } catch (orderError) {
      console.error('Erro ao criar pedido:', orderError);
      toast.error("Pagamento aprovado, mas houve um erro ao registrar o pedido. Entre em contato com o suporte.");
    }
  };

  return {
    paymentResult,
    cardPaymentStatus,
    handleCardPayment
  };
};
