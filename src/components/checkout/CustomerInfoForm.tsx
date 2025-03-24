
import React from 'react';

interface CustomerInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCPFChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  formData,
  handleChange,
  handlePhoneChange,
  handleCPFChange,
  handleCEPChange
}) => {
  return (
    <div className="space-y-4">
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
          onChange={handlePhoneChange}
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
          onChange={handleCPFChange}
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
          onChange={handleCEPChange}
          className="stitch-input"
          placeholder="00000-000"
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;
