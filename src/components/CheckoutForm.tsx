import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CreditCard, QrCode } from 'lucide-react';
import { 
  createPreference, 
  createPixPayment, 
  processCardPayment,
  initMercadoPago
} from '../utils/mercadoPago';

// Declare MercadoPago in the window object
declare global {
  interface Window {
    MercadoPago: any;
  }
}

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    complemento: '',
    complemento2: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    cpf: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code?: string; qr_code_base64?: string } | null>(null);
  const [cardFormVisible, setCardFormVisible] = useState(true);
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);

  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [cardToken, setCardToken] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [cardPaymentStatus, setCardPaymentStatus] = useState<string | null>(null);

  // Load MercadoPago SDK
  useEffect(() => {
    const loadMercadoPagoScript = () => {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        const mp = new window.MercadoPago(initMercadoPago());
        setMercadoPagoReady(true);
        console.log('MercadoPago SDK loaded successfully');
      };
      document.body.appendChild(script);
    };

    loadMercadoPagoScript();
  }, []);

  // Handle form payment method change
  useEffect(() => {
    // Reset PIX data when switching payment methods
    if (formData.formaPagamento !== 'pix') {
      setPixData(null);
    }
    
    // Show card form only when card is selected
    setCardFormVisible(formData.formaPagamento === 'cartao');
  }, [formData.formaPagamento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    
    // Determine card type
    const cardNumber = formattedValue.replace(/\D/g, '');
    let paymentMethodId = '';
    
    if (/^5[1-5]/.test(cardNumber)) paymentMethodId = 'master';
    else if (/^4/.test(cardNumber)) paymentMethodId = 'visa';
    else if (/^3[47]/.test(cardNumber)) paymentMethodId = 'amex';
    else if (/^(50|60|65)/.test(cardNumber)) paymentMethodId = 'elo';
    
    setPaymentMethodId(paymentMethodId);
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpirationDate(formatExpirationDate(e.target.value));
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  // Process PIX payment
  const handlePixPayment = async () => {
    setIsSubmitting(true);
    
    try {
      toast.info("Gerando QR Code PIX, aguarde...");
      
      // Create PIX payment
      const pixResult = await createPixPayment(formData);
      
      if (pixResult && (pixResult.qr_code || pixResult.qr_code_base64)) {
        setPixData(pixResult);
        toast.success("QR Code PIX gerado com sucesso! Escaneie para pagar.");
      } else {
        toast.error("Erro ao gerar QR Code PIX. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      toast.error("Houve um erro ao gerar o pagamento PIX. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process card payment
  const handleCardPayment = async () => {
    if (!mercadoPagoReady) {
      toast.error("O sistema de pagamento ainda não foi carregado. Aguarde alguns segundos.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      toast.info("Processando pagamento em ambiente de produção, aguarde...");
      
      // Get the cleaned card number (VISA test card)
      const cleanedCardNumber = cardNumber.replace(/\s/g, '');
      
      // Determine card type (very basic detection)
      let detectedPaymentMethodId = '';
      if (cleanedCardNumber.startsWith('4')) detectedPaymentMethodId = 'visa';
      else if (cleanedCardNumber.startsWith('5')) detectedPaymentMethodId = 'master';
      else if (cleanedCardNumber.startsWith('3')) detectedPaymentMethodId = 'amex';
      else detectedPaymentMethodId = 'other';
      
      // In a real production environment, you would generate a token from the card
      // For this test implementation, we'll simulate it
      const cardData = {
        token: "PROD-TOKEN-" + Date.now(),
        paymentMethodId: detectedPaymentMethodId,
        installments: 1,
        identificationNumber: formData.cpf,
        cardNumber: cleanedCardNumber  // Add this to help our test function
      };
      
      console.log("Processing payment in production environment with card data:", {
        type: detectedPaymentMethodId,
        cardNumber: cardNumber.substring(0, 4) + '********' + cardNumber.slice(-4)
      });
      
      // Process the payment
      const paymentResult = await processCardPayment(cardData, formData);
      
      if (paymentResult && paymentResult.status) {
        setCardPaymentStatus(paymentResult.status);
        
        if (paymentResult.status === 'approved') {
          toast.success("Pagamento aprovado com sucesso!");
        } else if (paymentResult.status === 'in_process') {
          toast.info("Pagamento em processamento. Você receberá uma confirmação em breve.");
        } else {
          toast.warning(`Status do pagamento: ${paymentResult.status}. ${paymentResult.status_detail || ''}`);
        }
      } else {
        toast.error("Erro ao processar pagamento. Verifique os dados do cartão.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento com cartão:", error);
      toast.error("Houve um erro ao processar seu pagamento. Por favor, verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.formaPagamento === 'pix') {
      await handlePixPayment();
    } else {
      await handleCardPayment();
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 rounded-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-2xl font-display font-bold text-stitch-pink mb-6 text-center">
        Preencha para comprar
      </h2>
      
      <div className="text-center mb-6">
        <div className="inline-block bg-stitch-pink text-white text-sm font-bold py-1 px-4 rounded-full mb-2">
          Promoção por tempo limitado!
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome*
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="stitch-input"
            placeholder="Seu nome completo"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="stitch-input"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone*
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            required
            value={formData.telefone}
            onChange={handleChange}
            className="stitch-input"
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF*
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            required
            value={formData.cpf}
            onChange={handleChange}
            className="stitch-input"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
            Endereço*
          </label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            required
            value={formData.endereco}
            onChange={handleChange}
            className="stitch-input"
            placeholder="Rua, número"
          />
        </div>
        
        <div>
          <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
            Complemento
          </label>
          <input
            type="text"
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            className="stitch-input"
            placeholder="Apartamento, bloco, etc"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
              Cidade*
            </label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              required
              value={formData.cidade}
              onChange={handleChange}
              className="stitch-input"
              placeholder="Sua cidade"
            />
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado*
            </label>
            <select
              id="estado"
              name="estado"
              required
              value={formData.estado}
              onChange={handleChange}
              className="stitch-select"
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
            CEP*
          </label>
          <input
            type="text"
            id="cep"
            name="cep"
            required
            value={formData.cep}
            onChange={handleChange}
            className="stitch-input"
            placeholder="00000-000"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Forma de Pagamento*
          </label>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.formaPagamento === 'cartao' 
                  ? 'border-stitch-blue bg-stitch-blue/10' 
                  : 'border-gray-300 hover:border-stitch-blue/50'
              }`}
              onClick={() => setFormData({...formData, formaPagamento: 'cartao'})}
            >
              <input 
                type="radio" 
                id="cartao" 
                name="formaPagamento" 
                value="cartao"
                checked={formData.formaPagamento === 'cartao'}
                onChange={handleChange}
                className="sr-only"
              />
              <CreditCard className={`h-5 w-5 ${formData.formaPagamento === 'cartao' ? 'text-stitch-blue' : 'text-gray-500'}`} />
              <label htmlFor="cartao" className="cursor-pointer font-medium">Cartão</label>
            </div>
            
            <div 
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.formaPagamento === 'pix' 
                  ? 'border-stitch-blue bg-stitch-blue/10' 
                  : 'border-gray-300 hover:border-stitch-blue/50'
              }`}
              onClick={() => setFormData({...formData, formaPagamento: 'pix'})}
            >
              <input 
                type="radio" 
                id="pix" 
                name="formaPagamento" 
                value="pix"
                checked={formData.formaPagamento === 'pix'}
                onChange={handleChange}
                className="sr-only"
              />
              <QrCode className={`h-5 w-5 ${formData.formaPagamento === 'pix' ? 'text-stitch-blue' : 'text-gray-500'}`} />
              <label htmlFor="pix" className="cursor-pointer font-medium">PIX</label>
            </div>
          </div>
        </div>
        
        {/* Form fields for credit card payment */}
        {cardFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 border-t pt-4"
          >
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
                required={formData.formaPagamento === 'cartao'}
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
                required={formData.formaPagamento === 'cartao'}
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
                  required={formData.formaPagamento === 'cartao'}
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
                  required={formData.formaPagamento === 'cartao'}
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
          </motion.div>
        )}
        
        {/* Show PIX QR code if generated */}
        {formData.formaPagamento === 'pix' && pixData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50"
          >
            <p className="font-medium mb-3 text-center">Escaneie o QR Code para pagar</p>
            
            {pixData.qr_code_base64 ? (
              <img 
                src={`data:image/png;base64,${pixData.qr_code_base64}`} 
                alt="QR Code PIX" 
                className="w-48 h-48 mb-2"
              />
            ) : pixData.qr_code ? (
              <div className="text-center p-3 bg-white rounded border mb-2">
                <QrCode className="w-36 h-36 mx-auto text-stitch-blue" />
                <p className="text-xs text-gray-500 mt-2">QR Code PIX</p>
              </div>
            ) : null}
            
            <p className="text-sm text-gray-600 text-center mt-2">Após o pagamento, você receberá a confirmação por email</p>
          </motion.div>
        )}
        
        {/* Payment status message */}
        {cardPaymentStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-lg text-center ${
              cardPaymentStatus === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : cardPaymentStatus === 'in_process'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {cardPaymentStatus === 'approved' && "Pagamento aprovado com sucesso!"}
            {cardPaymentStatus === 'in_process' && "Pagamento em processamento. Aguarde a confirmação."}
            {cardPaymentStatus !== 'approved' && cardPaymentStatus !== 'in_process' && `Pagamento ${cardPaymentStatus}. Verifique os dados.`}
          </motion.div>
        )}
        
        <motion.button 
          type="submit"
          className="btn-primary w-full mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Finalizar Compra"}
        </motion.button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Ao clicar em "Finalizar Compra", você concorda com nossos termos e condições.
        </p>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
