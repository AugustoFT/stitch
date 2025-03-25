
import React from 'react';
import { motion } from 'framer-motion';

interface FormErrorsProps {
  errors: string[];
  pixError: string | null;
}

const FormErrors: React.FC<FormErrorsProps> = ({ errors, pixError }) => {
  if (errors.length === 0 && !pixError) return null;

  return (
    <>
      {/* Display form validation errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p className="text-red-700 font-medium mb-1 text-sm">Por favor, corrija os seguintes erros:</p>
          <ul className="text-red-600 text-xs list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Display PIX generation error */}
      {pixError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p className="text-red-700 font-medium text-sm">{pixError}</p>
        </motion.div>
      )}
    </>
  );
};

export default FormErrors;
