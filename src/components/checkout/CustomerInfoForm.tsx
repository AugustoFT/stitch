
import React, { memo, useEffect } from 'react';
import PersonalInfoFields from '../form/PersonalInfoFields';
import AddressFields from '../form/AddressFields';
import { useFormattingHandlers } from '@/hooks/useFormattingHandlers';

interface CustomerInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCPFChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData?: (updater: (prev: any) => any) => void;
}

// Componente principal otimizado
const CustomerInfoForm: React.FC<CustomerInfoFormProps> = memo(({
  formData,
  handleChange,
  handlePhoneChange,
  handleCPFChange,
  handleCEPChange,
  setFormData
}) => {
  // Usa handlers otimizados se setFormData estiver disponível
  const optimizedHandlers = setFormData ? 
    useFormattingHandlers({ setFormData }) : 
    { handleCPFChange, handlePhoneChange, handleCEPChange, cleanup: () => {} };

  // Limpa timers ao desmontar
  useEffect(() => {
    return () => {
      optimizedHandlers.cleanup();
    };
  }, [optimizedHandlers]);

  return (
    <div className="space-y-4 form-container" style={{ contain: 'content' }}>
      {/* Seção de informações pessoais com componentes otimizados */}
      <PersonalInfoFields
        formData={formData}
        handleChange={handleChange}
        handlePhoneChange={setFormData ? optimizedHandlers.handlePhoneChange : handlePhoneChange}
        handleCPFChange={setFormData ? optimizedHandlers.handleCPFChange : handleCPFChange}
      />
      
      {/* Seção de endereço com componentes otimizados */}
      <AddressFields
        formData={formData}
        handleChange={handleChange}
        handleCEPChange={setFormData ? optimizedHandlers.handleCEPChange : handleCEPChange}
      />
    </div>
  );
});

CustomerInfoForm.displayName = 'CustomerInfoForm';

export default CustomerInfoForm;
