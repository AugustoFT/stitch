
import React, { memo } from 'react';
import AddressInputField from './fields/AddressInputField';
import SelectField from './SelectField';
import CEPField from './fields/CEPField';
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
  handleCEPChange: (value: string) => void;
}

const AddressFields = memo(({ 
  formData, 
  handleChange, 
  handleCEPChange 
}: AddressFieldsProps) => {
  return (
    <>
      {/* Endereço otimizado */}
      <AddressInputField
        id="endereco"
        label="Rua"
        required
        value={formData.endereco || ''}
        onChange={handleChange}
        placeholder="Nome da rua"
      />
      
      <AddressInputField
        id="numero"
        label="Número"
        required
        value={formData.numero || ''}
        onChange={handleChange}
        placeholder="Número"
      />
      
      <AddressInputField
        id="complemento"
        label="Complemento"
        value={formData.complemento || ''}
        onChange={handleChange}
        placeholder="Apartamento, bloco, etc"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <AddressInputField
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
      
      {/* CEP com máscara DOM direta */}
      <CEPField
        value={formData.cep || ''}
        onBlur={handleCEPChange}
        required
      />
    </>
  );
});

AddressFields.displayName = 'AddressFields';

export default AddressFields;
