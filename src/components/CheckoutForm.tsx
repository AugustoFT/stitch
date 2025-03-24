
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    complemento: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pedido realizado com sucesso! Em breve você receberá mais informações por email.");
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      complemento: '',
      cidade: '',
      estado: '',
      cep: '',
      formaPagamento: 'cartao'
    });
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
        
        <div>
          <label htmlFor="formaPagamento" className="block text-sm font-medium text-gray-700 mb-1">
            Forma de Pagamento*
          </label>
          <select
            id="formaPagamento"
            name="formaPagamento"
            required
            value={formData.formaPagamento}
            onChange={handleChange}
            className="stitch-select"
          >
            <option value="cartao">Cartão de Crédito</option>
            <option value="pix">PIX</option>
          </select>
        </div>
        
        <motion.button 
          type="submit"
          className="btn-primary w-full mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Finalizar Compra
        </motion.button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Ao clicar em "Finalizar Compra", você concorda com nossos termos e condições.
        </p>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
