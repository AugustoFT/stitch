
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Função para identificar e corrigir problemas com carregamento de CSS
const handleCssLoadingError = () => {
  document.addEventListener('error', (event) => {
    const target = event.target;
    // Type guard para verificar se o target é um elemento HTML
    if (!(target instanceof HTMLElement)) return;
    
    // Corrige erros de carregamento de CSS
    if (target instanceof HTMLLinkElement && 
        target.rel === 'stylesheet' && 
        target.href.includes('.css')) {
      
      console.warn(`Erro ao carregar CSS: ${target.href}`);
      
      // Tenta recarregar o CSS
      const retryLink = document.createElement('link');
      retryLink.rel = 'stylesheet';
      retryLink.href = target.href.split('?')[0] + '?retry=' + new Date().getTime();
      retryLink.crossOrigin = target.crossOrigin;
      
      // Adiciona tratamento de erro também para o CSS de fallback
      retryLink.onerror = () => {
        console.error(`Erro persistente ao carregar CSS: ${target.href}`);
        
        // Aplica estilos mínimos para garantir usabilidade
        const fallbackStyles = document.createElement('style');
        fallbackStyles.textContent = `
          body { font-family: system-ui, sans-serif; }
          .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem; }
          .text-center { text-align: center; }
          .btn { display: inline-block; padding: 0.5rem 1rem; background: #0077cc; color: white; border-radius: 4px; text-decoration: none; }
          .card { border: 1px solid #eee; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
        `;
        document.head.appendChild(fallbackStyles);
      };
      
      document.head.appendChild(retryLink);
    }
  }, true); // Usando captura para pegar erros antes de propagarem
};

// Inicializa gerenciamento de erros CSS
handleCssLoadingError();

// Função para inicializar o aplicativo com tratamento de erros
const mountApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Elemento raiz não encontrado. Criando um novo elemento root.');
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
    return;
  }
  
  try {
    createRoot(rootElement).render(<App />);
    console.log('Aplicativo renderizado com sucesso!');
  } catch (error) {
    console.error('Erro ao renderizar o aplicativo:', error);
    
    // Renderiza uma mensagem de fallback se o app falhar
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h1>Ops! Algo deu errado.</h1>
        <p>Tente recarregar a página. Se o problema persistir, entre em contato conosco.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0077cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
          Recarregar Página
        </button>
      </div>
    `;
  }
};

// Inicia o aplicativo quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
