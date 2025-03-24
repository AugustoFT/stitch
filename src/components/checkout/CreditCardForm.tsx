
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { processCardPayment } from '../../utils/mercadoPago';
import { Check } from 'lucide-react';

interface CreditCardFormProps {
  formData: any;
  isSubmitting: boolean;
  mercadoPagoReady: boolean;
  setIsSubmitting: (value: boolean) => void;
  setPaymentResult: (value: any) => void;
  setCardPaymentStatus: (value: string | null) => void;
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
  setCardPaymentStatus
}) => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardholderName, setCardholderName] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [securityCode, setSecurityCode] = React.useState('');
  const [paymentResult, setLocalPaymentResult] = React.useState<any>(null);
  const [cardPaymentStatus, setLocalCardPaymentStatus] = React.useState<string | null>(null);
  
  // Format credit card inputs
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
    
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    
    return formatted.slice(0, 5); // MM/YY format
  };

  // Handle card input changes
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpirationDate(formatExpirationDate(e.target.value));
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4));
  };
  
  const handleCardPayment = async () => {
    if (!mercadoPagoReady) {
      toast.error("O sistema de pagamento ainda não foi carregado. Aguarde alguns segundos.");
      return;
    }
    
    setIsSubmitting(true);
    setPaymentResult(null);
    setCardPaymentStatus(null);
    
    try {
      toast.info("Processando pagamento, aguarde...");
      
      // Validate form data before proceeding
      if (!formData.nome || !formData.email || !formData.cpf || !formData.endereco || !formData.cep) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setIsSubmitting(false);
        return;
      }
      
      if (!cardNumber || !cardholderName || !expirationDate || !securityCode) {
        toast.error("Por favor, preencha todos os dados do cartão.");
        setIsSubmitting(false);
        return;
      }
      
      // Get card data and process payment
      const cardData: CardData = {
        cardNumber,
        cardholderName,
        expirationDate,
        securityCode
      };
      
      console.log("Processando pagamento com os dados:", {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''),
        cartao: cardData.cardNumber.slice(0, 4) + '******' + cardData.cardNumber.slice(-4)
      });
      
      // Process the payment directly
      const result = await processCardPayment(cardData, formData);
      
      console.log("Resultado do pagamento:", result);
      
      setLocalPaymentResult(result);
      setLocalCardPaymentStatus(result.status);
      
      // Pass results up to parent component
      setPaymentResult(result);
      setCardPaymentStatus(result.status);
      
      if (result.status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
      } else if (result.status === 'in_process' || result.status === 'pending') {
        toast.info("Pagamento em processamento. Aguarde a confirmação.");
      } else {
        toast.error(`Pagamento ${result.status}. ${result.status_detail || 'Verifique os dados do cartão.'}`);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento com cartão:", error);
      toast.error("Houve um erro ao processar o pagamento. Por favor, verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render payment success message
  const renderPaymentSuccess = () => {
    if (!paymentResult || paymentResult.status !== 'approved') return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.4 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center"
      >
        <div className="bg-green-100 p-3 rounded-full mb-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-green-800 font-semibold text-lg mb-1">Pagamento Aprovado!</h3>
        <p className="text-green-700 text-center">
          Sua compra foi processada com sucesso. Você receberá um e-mail com os detalhes.
        </p>
        {paymentResult.id && (
          <p className="text-xs text-green-600 mt-2">
            ID da transação: {paymentResult.id}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 border-t pt-4"
    >
      {renderPaymentSuccess()}
      
      {(!paymentResult || paymentResult.status !== 'approved') && (
        <>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número do Cartão*
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="stitch-input"
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>
          
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome no Cartão*
            </label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
              className="stitch-input"
              placeholder="NOME COMO ESTÁ NO CARTÃO"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Validade*
              </label>
              <input
                type="text"
                id="expirationDate"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                className="stitch-input"
                placeholder="MM/AA"
                required
              />
            </div>
            <div>
              <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-1">
                CVV*
              </label>
              <input
                type="text"
                id="securityCode"
                value={securityCode}
                onChange={handleSecurityCodeChange}
                className="stitch-input"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold text-gray-800 mb-1">Cartões de teste disponíveis:</p>
            <p className="text-gray-600">VISA: 4235 6477 2802 5682</p>
            <p className="text-gray-600">MASTERCARD: 5031 4332 1540 6351</p>
            <p className="text-gray-600">AMEX: 3753 651535 56885</p>
            <p className="text-gray-600">Para todos: CVV 123, Validade: 11/30</p>
          </div>
          
          {/* Show payment status if available */}
          {cardPaymentStatus && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg text-center ${
                cardPaymentStatus === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : cardPaymentStatus === 'in_process' || cardPaymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {paymentResult && paymentResult.message}
            </motion.div>
          )}
          
          <motion.button 
            type="button"
            className="btn-primary w-full mt-6"
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
