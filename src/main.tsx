
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Iniciando aplicação...");

// Função auxiliar para exibir erros na tela
function displayError(element: HTMLElement, error: Error | unknown) {
  console.error("Erro na aplicação:", error);
  element.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center; font-family: sans-serif;">
      <h2>Erro ao carregar aplicação</h2>
      <p>${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      <button onclick="window.location.reload()" 
              style="margin-top: 20px; padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Tentar novamente
      </button>
    </div>
  `;
}

// Implementando uma função de retry avançada para CSS falhos
function retryFailedCssLoad() {
  // Contador para tentativas de CSS
  const cssRetryAttempts = new Map();
  const MAX_RETRIES = 3;
  
  window.addEventListener('error', function(e) {
    // Verifica se o erro está relacionado a carregamento de CSS
    if (e.target && (e.target instanceof HTMLLinkElement || e.target instanceof HTMLStyleElement)) {
      const cssPath = e.target instanceof HTMLLinkElement ? e.target.href : 'inline-style';
      console.warn('Erro ao carregar recurso CSS:', cssPath);
      
      // Se for um link, tenta recarregar com estratégia de fallback
      if (e.target instanceof HTMLLinkElement && e.target.href) {
        // Contagem de tentativas para este CSS específico
        const currentAttempts = cssRetryAttempts.get(e.target.href) || 0;
        
        if (currentAttempts < MAX_RETRIES) {
          cssRetryAttempts.set(e.target.href, currentAttempts + 1);
          
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = e.target.href + '?retry=' + new Date().getTime(); // Adiciona timestamp para evitar cache
          
          // Adiciona um evento onload para confirmar sucesso
          newLink.onload = () => {
            console.log('CSS recarregado com sucesso:', newLink.href);
          };
          
          document.head.appendChild(newLink);
          console.log('Tentativa ' + (currentAttempts + 1) + ' de recarregar CSS:', newLink.href);
        } else {
          console.warn('Número máximo de tentativas atingido para:', e.target.href);
          // Carrega o CSS básico inline como fallback
          const fallbackStyle = document.createElement('style');
          fallbackStyle.textContent = `
            body { font-family: sans-serif; }
            .app-container { display: flex; flex-direction: column; min-height: 100vh; }
            .content-container { flex: 1; }
          `;
          document.head.appendChild(fallbackStyle);
        }
      }
    }
  }, true);
  
  // Adiciona um timeout para verificar se a aplicação carregou
  setTimeout(() => {
    const root = document.getElementById('root');
    if (root && (root.children.length === 0 || 
        (root.children.length === 1 && root.children[0].classList.contains('loading-container')))) {
      console.warn('Aplicação não carregou completamente após timeout, aplicando fallbacks');
      
      // Injeta CSS básico de fallback
      const emergencyStyle = document.createElement('style');
      emergencyStyle.textContent = `
        body { font-family: sans-serif; background: white; color: black; }
        #root { padding: 20px; }
        button { cursor: pointer; background: #0066ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; }
      `;
      document.head.appendChild(emergencyStyle);
      
      // Tenta inicializar a aplicação novamente
      try {
        initApp();
      } catch (error) {
        console.error('Falha na reinicialização de emergência:', error);
      }
    }
  }, 5000);
}

// Inicialização da aplicação com mais verificações de erro
function initApp() {
  // Implementa retry para CSS
  retryFailedCssLoad();
  
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("ERRO CRÍTICO: Elemento root não encontrado no DOM!");
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; text-align: center; font-family: sans-serif;">
        <h2>Erro crítico</h2>
        <p>Elemento root não encontrado. Por favor, recarregue a página.</p>
        <button onclick="window.location.reload()" 
                style="margin-top: 20px; padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar página
        </button>
      </div>
    `;
    return;
  }
  
  console.log("Elemento root encontrado, iniciando renderização");
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Aplicação React montada com sucesso");
  } catch (error) {
    displayError(rootElement, error);
  }
}

// Inicializa a aplicação quando o DOM estiver totalmente carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
