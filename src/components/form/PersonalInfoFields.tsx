
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
  handlePhoneChange: (value: string) => void;
  handleCPFChange: (value: string) => void;
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
      
      {/* Campo de telefone com máscara DOM direta */}
      <PhoneField
        value={formData.telefone || ''}
        onBlur={handlePhoneChange}
        required
      />
      
      {/* Campo de CPF com máscara DOM direta */}
      <CPFField
        value={formData.cpf || ''}
        onBlur={handleCPFChange}
        required
      />
    </>
  );
});

PersonalInfoFields.displayName = 'PersonalInfoFields';

export default PersonalInfoFields;
