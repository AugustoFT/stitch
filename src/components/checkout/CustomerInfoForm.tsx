
import React, { memo } from 'react';
import PersonalInfoFields from '../form/PersonalInfoFields';
import AddressFields from '../form/AddressFields';

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
      {/* Seção de informações pessoais */}
      <PersonalInfoFields
        formData={formData}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleCPFChange={handleCPFChange}
      />
      
      {/* Seção de endereço */}
      <AddressFields
        formData={formData}
        handleChange={handleChange}
        handleCEPChange={handleCEPChange}
      />
    </div>
  );
};

export default memo(CustomerInfoForm);
