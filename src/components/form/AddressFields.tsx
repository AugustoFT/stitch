
import React, { memo } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import { stateOptions } from './StateOptions';

interface AddressFieldsProps {
  formData: {
    endereco: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressFields = memo(({ 
  formData, 
  handleChange, 
  handleCEPChange 
}: AddressFieldsProps) => {
  return (
    <>
      <FormField
        id="endereco"
        label="Rua"
        required
        value={formData.endereco || ''}
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
        value={formData.complemento || ''}
        onChange={handleChange}
        placeholder="Apartamento, bloco, etc"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="cidade"
          label="Cidade"
          required
          value={formData.cidade || ''}
          onChange={handleChange}
          placeholder="Sua cidade"
          className="w-full"
        />
        
        <SelectField
          id="estado"
          label="Estado"
          required
          value={formData.estado || ''}
          onChange={handleChange}
          options={stateOptions}
          className="w-full"
        />
      </div>
      
      <FormField
        id="cep"
        label="CEP"
        required
        value={formData.cep || ''}
        onChange={handleCEPChange}
        placeholder="00000-000"
      />
    </>
  );
});

AddressFields.displayName = 'AddressFields';

export default AddressFields;
