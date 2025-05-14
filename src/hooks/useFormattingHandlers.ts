
import { useCallback, useRef, useTransition } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';
import { formatCPF, formatPhoneNumber, formatCEP } from '@/components/checkout/InputFormatters';

interface FormattingHandlersProps {
  setFormData: (updater: (prev: any) => any) => void;
}

export const useFormattingHandlers = ({ setFormData }: FormattingHandlersProps) => {
  // Use refs para evitar re-renderizações desnecessárias
  const prevValues = useRef({
    cpf: '',
    telefone: '',
    cep: ''
  });
  
  // useTransition para operações de baixa prioridade
  const [isPending, startTransition] = useTransition();

  // Handler CPF otimizado com debounce
  const handleCPFChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Atualização imediata para feedback visual
    if (input === '') {
      setFormData(prev => ({ ...prev, cpf: '' }));
      prevValues.current.cpf = '';
      return;
    }
    
    // Formatação com baixa prioridade
    startTransition(() => {
      const formattedValue = formatCPF(input);
      
      // Só atualiza se o valor for diferente
      if (formattedValue !== prevValues.current.cpf) {
        setFormData(prev => ({ ...prev, cpf: formattedValue }));
        prevValues.current.cpf = formattedValue;
      }
    });
  }, 200);
  
  // Handler telefone otimizado com debounce
  const handlePhoneChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Atualização imediata para feedback visual
    if (input === '') {
      setFormData(prev => ({ ...prev, telefone: '' }));
      prevValues.current.telefone = '';
      return;
    }
    
    // Formatação com baixa prioridade
    startTransition(() => {
      const formattedValue = formatPhoneNumber(input);
      
      // Só atualiza se o valor for diferente
      if (formattedValue !== prevValues.current.telefone) {
        setFormData(prev => ({ ...prev, telefone: formattedValue }));
        prevValues.current.telefone = formattedValue;
      }
    });
  }, 200);
  
  // Handler CEP otimizado com debounce
  const handleCEPChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Atualização imediata para feedback visual
    if (input === '') {
      setFormData(prev => ({ ...prev, cep: '' }));
      prevValues.current.cep = '';
      return;
    }
    
    // Formatação com baixa prioridade
    startTransition(() => {
      const formattedValue = formatCEP(input);
      
      // Só atualiza se o valor for diferente
      if (formattedValue !== prevValues.current.cep) {
        setFormData(prev => ({ ...prev, cep: formattedValue }));
        prevValues.current.cep = formattedValue;
      }
    });
  }, 200);

  // Função utilitária para limpar timers e prevenir vazamento de memória
  const cleanup = useCallback(() => {
    // Implementada no hook de debounce
  }, []);

  return {
    handleCPFChange,
    handlePhoneChange,
    handleCEPChange,
    isPending,
    cleanup
  };
};
