
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { processCardPayment, processCardPaymentOffline, isProduction, getEnvironment } from '../../utils/mercadoPago';
import { createNewOrder } from '../../utils/orders/orderManager';
import CardPaymentSuccess from './CardPaymentSuccess';
import CardPaymentWrapper from './card/CardPaymentWrapper';
import { useCardFormValidation } from './hooks/useCardFormValidation';

interface CreditCardFormProps {
  formData: any;
  isSubmitting: boolean;
  mercadoPagoReady: boolean;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
  selectedProducts?: any[];
  totalAmount?: number;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  formData,
  isSubmitting,
  mercadoPagoReady,
  setIsSubmitting,
  setPaymentResult,
  setCardPaymentStatus,
  selectedProducts = [],
  totalAmount = 139.99
}) => {
  const [installments, setInstallments] = useState(1);
  const [paymentResult, setLocalPaymentResult] = useState<any>(null);
  const [cardPaymentStatus, setLocalCardPaymentStatus] = useState<string | null>(null);
  
  const {
    cardData,
    errors,
    setCardField,
    validateField,
    validateAllFields,
    loadSavedCardData,
    saveFormData
  } = useCardFormValidation();

  useEffect(() => {
    loadSavedCardData();
  }, []);

  // Se totalAmount mudar, verificar se o número atual de parcelas ainda é válido
  useEffect(() => {
    if (installments > 1 && totalAmount < 10) {
      setInstallments(1);
    }
  }, [totalAmount, installments]);

  const getProductDescription = () => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return 'Pelúcia Stitch';
    }
    
    if (selectedProducts.length === 1) {
      return selectedProducts[0].title;
    }
    
    return `Compra Stitch (${selectedProducts.length} itens)`;
  };

  const handleCardPayment = async () => {
    if (!mercadoPagoReady) {
      toast.error("O sistema de pagamento ainda não foi carregado. Aguarde alguns segundos.");
      return;
    }
    
    saveFormData();
    
    if (!validateAllFields()) {
      toast.error("Por favor, corrija os erros no formulário antes de continuar.");
      return;
    }
    
    setIsSubmitting(true);
    setPaymentResult(null);
    setCardPaymentStatus(null);
    
    try {
      toast.info("Processando pagamento, aguarde...");
      
      if (!formData.nome || !formData.email || !formData.cpf) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setIsSubmitting(false);
        return;
      }
      
      console.log('Form data:', formData);
      console.log('Total amount:', totalAmount);
      console.log('Installments:', installments);
      
      let result;
      if (isProduction()) {
        console.log('Processando pagamento em ambiente de PRODUÇÃO');
        result = await processCardPayment(
          cardData, 
          formData, 
          installments, 
          totalAmount, 
          getProductDescription()
        );
      } else {
        console.log('Processando pagamento em ambiente de DESENVOLVIMENTO');
        result = await processCardPaymentOffline(
          cardData, 
          formData, 
          installments, 
          totalAmount, 
          getProductDescription()
        );
      }
      
      console.log('Payment result:', result);
      
      setLocalPaymentResult(result);
      setLocalCardPaymentStatus(result.status);
      
      setPaymentResult(result);
      setCardPaymentStatus(result.status);
      
      if (result.status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
        
        // Criar pedido após aprovação do pagamento
        try {
          // Preparar produtos para o pedido
          const orderProducts = selectedProducts.map(product => ({
            id: product.id,
            name: product.title,
            quantity: product.quantity,
            price: parseFloat(product.price.replace('R$ ', '').replace(',', '.')),
            imageUrl: product.imageUrl
          }));
          
          // Preparar informações do cliente
          const customerInfo = {
            name: formData.nome,
            email: formData.email,
            phone: formData.telefone,
            address: formData.endereco,
            city: formData.cidade,
            state: formData.estado,
            zip: formData.cep,
            cpf: formData.cpf
          };
          
          // Criar pedido no sistema
          const order = await createNewOrder(
            orderProducts,
            customerInfo,
            'credit_card',
            result.id
          );
          
          console.log('Pedido criado com sucesso:', order);
          
          // Adicionar informação do pedido ao resultado do pagamento
          result.orderId = order.id;
          setPaymentResult({...result, orderId: order.id});
          
          toast.success("Pedido registrado com sucesso!");
        } catch (orderError) {
          console.error('Erro ao criar pedido:', orderError);
          toast.error("Pagamento aprovado, mas houve um erro ao registrar o pedido. Entre em contato com o suporte.");
        }
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

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 border-t pt-4"
    >
      <CardPaymentSuccess paymentResult={paymentResult} />
      
      {(!paymentResult || paymentResult.status !== 'approved') && (
        <CardPaymentWrapper
          cardData={cardData}
          errors={errors}
          installments={installments}
          paymentResult={paymentResult}
          cardPaymentStatus={cardPaymentStatus}
          isSubmitting={isSubmitting}
          totalAmount={totalAmount}
          setInstallments={setInstallments}
          setCardField={setCardField}
          validateField={validateField}
          handleCardPayment={handleCardPayment}
        />
      )}
    </motion.div>
  );
};

export default CreditCardForm;
