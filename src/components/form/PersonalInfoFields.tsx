
import React, { memo } from 'react';
import FormField from './FormField';
import PhoneField from './fields/PhoneField';
import CPFField from './fields/CPFField';

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
      
      {/* Componente otimizado para telefone */}
      <PhoneField
        value={formData.telefone || ''}
        onChange={handlePhoneChange}
        required
      />
      
      {/* Componente otimizado para CPF */}
      <CPFField
        value={formData.cpf || ''}
        onChange={handleCPFChange}
        required
      />
    </>
  );
});

PersonalInfoFields.displayName = 'PersonalInfoFields';

export default PersonalInfoFields;
