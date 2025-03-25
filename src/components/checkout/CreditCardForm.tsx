import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { processCardPayment, processCardPaymentOffline, isProduction, getEnvironment, ENV, setEnvironment } from '../../utils/mercadoPago';
import CardPaymentSuccess from './CardPaymentSuccess';
import CardInputs from './CardInputs';
import InstallmentSelector from './InstallmentSelector';
import PaymentStatusIndicator from './PaymentStatusIndicator';
import { validateCardField } from './CardFormatters';

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

interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
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
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardholderName, setCardholderName] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [securityCode, setSecurityCode] = React.useState('');
  const [installments, setInstallments] = React.useState(1);
  const [paymentResult, setLocalPaymentResult] = React.useState<any>(null);
  const [cardPaymentStatus, setLocalCardPaymentStatus] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'lilo-stitch.com' || hostname.includes('mercadopago')) {
      setEnvironment(ENV.PRODUCTION);
    } else {
      setEnvironment(ENV.DEVELOPMENT);
    }
    console.log(`Ambiente configurado: ${getEnvironment()}`);
  }, []);

  useEffect(() => {
    const savedCardData = localStorage.getItem('cardFormData');
    if (savedCardData) {
      try {
        const parsedData = JSON.parse(savedCardData);
        setCardNumber(parsedData.cardNumber || '');
        setCardholderName(parsedData.cardholderName || '');
      } catch (e) {
        console.error('Error parsing saved card data', e);
      }
    }
  }, []);

  const saveFormData = () => {
    const dataToSave = {
      cardNumber,
      cardholderName
    };
    localStorage.setItem('cardFormData', JSON.stringify(dataToSave));
  };

  const validateField = (field: string, value: string) => {
    const errorMessage = validateCardField(field, value);
    
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const validateAllFields = () => {
    const cardNumberValid = validateField('cardNumber', cardNumber);
    const cardholderNameValid = validateField('cardholderName', cardholderName);
    const expirationDateValid = validateField('expirationDate', expirationDate);
    const securityCodeValid = validateField('securityCode', securityCode);
    
    return cardNumberValid && cardholderNameValid && expirationDateValid && securityCodeValid;
  };

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
      
      const cardData: CardData = {
        cardNumber,
        cardholderName,
        expirationDate,
        securityCode
      };
      
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
        <>
          <CardInputs
            cardNumber={cardNumber}
            cardholderName={cardholderName}
            expirationDate={expirationDate}
            securityCode={securityCode}
            errors={errors}
            setCardNumber={setCardNumber}
            setCardholderName={setCardholderName}
            setExpirationDate={setExpirationDate}
            setSecurityCode={setSecurityCode}
            validateField={validateField}
          />
          
          <InstallmentSelector
            installments={installments}
            setInstallments={setInstallments}
            totalAmount={totalAmount}
          />
          
          <PaymentStatusIndicator
            paymentStatus={cardPaymentStatus}
            paymentResult={paymentResult}
          />
          
          <motion.button 
            type="button"
            className="btn-primary w-full mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            onClick={handleCardPayment}
          >
            {isSubmitting ? "Processando..." : "Finalizar Compra"}
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default CreditCardForm;
