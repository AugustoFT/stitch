
import { useCallback, useRef } from 'react';

interface FormattingHandlersProps {
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormattingHandlers = ({ setFormData }: FormattingHandlersProps) => {
  // As formatações agora acontecem diretamente no DOM, não precisamos mais guardar valores anteriores
  
  // O telefone só é atualizado no blur, não a cada tecla
  const handlePhoneChange = useCallback((value: string) => {
    // Atualiza o estado global apenas quando o usuário termina de digitar (onBlur)
    setFormData(prev => ({ ...prev, telefone: value }));
  }, [setFormData]);
  
  // O CPF só é atualizado no blur, não a cada tecla
  const handleCPFChange = useCallback((value: string) => {
    // Atualiza o estado global apenas quando o usuário termina de digitar (onBlur)
    setFormData(prev => ({ ...prev, cpf: value }));
  }, [setFormData]);
  
  // O CEP só é atualizado no blur, não a cada tecla
  const handleCEPChange = useCallback((value: string) => {
    // Atualiza o estado global apenas quando o usuário termina de digitar (onBlur)
    setFormData(prev => ({ ...prev, cep: value }));
  }, [setFormData]);

  // Função utilitária para limpar qualquer pendência
  const cleanup = useCallback(() => {
    // Não há mais timers para limpar pois a formatação ocorre no DOM
  }, []);

  return {
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange,
    cleanup
  };
};
