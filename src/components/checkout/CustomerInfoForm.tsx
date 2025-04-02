
import React, { memo } from 'react';
import { Input } from '../ui/input';

interface CustomerInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCPFChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Componente para um campo de formulário individual para reduzir renderizações
const FormField = memo(({ 
  id, 
  label, 
  required = false, 
  value, 
  onChange, 
  placeholder, 
  type = "text" 
}: { 
  id: string; 
  label: string; 
  required?: boolean; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder: string; 
  type?: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && '*'}
    </label>
    <Input
      type={type}
      id={id}
      name={id}
      required={required}
      value={value}
      onChange={onChange}
      className="stitch-input"
      placeholder={placeholder}
    />
  </div>
));

FormField.displayName = 'FormField';

// Componente para um campo Select
const SelectField = memo(({ 
  id, 
  label, 
  required = false, 
  value, 
  onChange, 
  options 
}: { 
  id: string; 
  label: string; 
  required?: boolean; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  options: { value: string; label: string }[];
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && '*'}
    </label>
    <select
      id={id}
      name={id}
      required={required}
      value={value}
      onChange={onChange}
      className="stitch-select"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

SelectField.displayName = 'SelectField';

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  formData,
  handleChange,
  handlePhoneChange,
  handleCPFChange,
  handleCEPChange
}) => {
  // Opções para o select de estados
  const stateOptions = [
    { value: "", label: "Selecione" },
    { value: "AC", label: "AC" },
    { value: "AL", label: "AL" },
    { value: "AP", label: "AP" },
    { value: "AM", label: "AM" },
    { value: "BA", label: "BA" },
    { value: "CE", label: "CE" },
    { value: "DF", label: "DF" },
    { value: "ES", label: "ES" },
    { value: "GO", label: "GO" },
    { value: "MA", label: "MA" },
    { value: "MT", label: "MT" },
    { value: "MS", label: "MS" },
    { value: "MG", label: "MG" },
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PR", label: "PR" },
    { value: "PE", label: "PE" },
    { value: "PI", label: "PI" },
    { value: "RJ", label: "RJ" },
    { value: "RN", label: "RN" },
    { value: "RS", label: "RS" },
    { value: "RO", label: "RO" },
    { value: "RR", label: "RR" },
    { value: "SC", label: "SC" },
    { value: "SP", label: "SP" },
    { value: "SE", label: "SE" },
    { value: "TO", label: "TO" }
  ];

  return (
    <div className="space-y-4">
      <FormField
        id="nome"
        label="Nome"
        required
        value={formData.nome}
        onChange={handleChange}
        placeholder="Seu nome completo"
      />
      
      <FormField
        id="email"
        label="Email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="seu@email.com"
        type="email"
      />
      
      <FormField
        id="telefone"
        label="Telefone"
        required
        value={formData.telefone}
        onChange={handlePhoneChange}
        placeholder="(00) 00000-0000"
      />
      
      <FormField
        id="cpf"
        label="CPF"
        required
        value={formData.cpf}
        onChange={handleCPFChange}
        placeholder="000.000.000-00"
      />
      
      <FormField
        id="endereco"
        label="Rua"
        required
        value={formData.endereco}
        onChange={handleChange}
        placeholder="Nome da rua"
      />
      
      <FormField
        id="numero"
        label="Número"
        required
        value={formData.numero || ''}
        onChange={handleChange}
        placeholder="Número"
      />
      
      <FormField
        id="complemento"
        label="Complemento"
        value={formData.complemento}
        onChange={handleChange}
        placeholder="Apartamento, bloco, etc"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="cidade"
          label="Cidade"
          required
          value={formData.cidade}
          onChange={handleChange}
          placeholder="Sua cidade"
        />
        
        <SelectField
          id="estado"
          label="Estado"
          required
          value={formData.estado}
          onChange={handleChange}
          options={stateOptions}
        />
      </div>
      
      <FormField
        id="cep"
        label="CEP"
        required
        value={formData.cep}
        onChange={handleCEPChange}
        placeholder="00000-000"
      />
    </div>
  );
};

export default memo(CustomerInfoForm);
