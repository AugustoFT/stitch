
import React, { memo } from 'react';
import FormField from './FormField';

interface PersonalInfoFieldsProps {
  formData: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCPFChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields = memo(({ 
  formData, 
  handleChange, 
  handlePhoneChange, 
  handleCPFChange 
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        id="nome"
        label="Nome"
        required
        value={formData.nome || ''}
        onChange={handleChange}
        placeholder="Seu nome completo"
      />
      
      <FormField
        id="email"
        label="Email"
        required
        value={formData.email || ''}
        onChange={handleChange}
        placeholder="seu@email.com"
        type="email"
      />
      
      <FormField
        id="telefone"
        label="Telefone"
        required
        value={formData.telefone || ''}
        onChange={handlePhoneChange}
        placeholder="(00) 00000-0000"
      />
      
      <FormField
        id="cpf"
        label="CPF"
        required
        value={formData.cpf || ''}
        onChange={handleCPFChange}
        placeholder="000.000.000-00"
      />
    </>
  );
});

PersonalInfoFields.displayName = 'PersonalInfoFields';

export default PersonalInfoFields;
