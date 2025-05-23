
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { eventTrackers } from '../../../utils/dataLayer';

interface GeneratePixButtonProps {
  isSubmitting: boolean;
  onClick: () => void;
}

const GeneratePixButton: React.FC<GeneratePixButtonProps> = ({ isSubmitting, onClick }) => {
  const handleGeneratePixClick = () => {
    // Track event with dataLayer
    eventTrackers.gerarQrCodePix();
    
    onClick();
  };
  
  return (
    <motion.button 
      type="button"
      className="btn-primary w-full mt-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isSubmitting}
      onClick={handleGeneratePixClick}
    >
      {isSubmitting ? "Gerando PIX..." : (
        <span className="flex items-center justify-center gap-2">
          <QrCode className="h-4 w-4" />
          Gerar QR Code PIX
        </span>
      )}
    </motion.button>
  );
};

export default GeneratePixButton;
