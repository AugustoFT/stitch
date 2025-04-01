
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

// Implementando uma função de retry avançada para CSS falhos com tipagem correta
function retryFailedCssLoad() {
  // Contador para tentativas de CSS
  const cssRetryAttempts = new Map<string, number>();
  const MAX_RETRIES = 3;
  
  window.addEventListener('error', function(e) {
    // Verifica se o erro está relacionado a carregamento de CSS com tipagem correta
    const target = e.target;
    if (!target) return;
    
    // Verificações de tipo seguras
    const isLinkElement = target instanceof HTMLLinkElement;
    const isStyleElement = target instanceof HTMLStyleElement;
    
    if (isLinkElement || isStyleElement) {
      const cssPath = isLinkElement && target.href ? target.href : 'inline-style';
      console.warn('Erro ao carregar recurso CSS:', cssPath);
      
      // Se for um link, tenta recarregar com estratégia de fallback
      if (isLinkElement && target.href) {
        // Contagem de tentativas para este CSS específico
        const currentAttempts = cssRetryAttempts.get(target.href) || 0;
        
        if (currentAttempts < MAX_RETRIES) {
          cssRetryAttempts.set(target.href, currentAttempts + 1);
          
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = target.href + '?retry=' + new Date().getTime(); // Adiciona timestamp para evitar cache
          
          // Adiciona um evento onload para confirmar sucesso
          newLink.onload = () => {
            console.log('CSS recarregado com sucesso:', newLink.href);
          };
          
          // Adiciona handler para erro também
          newLink.onerror = () => {
            console.error('Falha ao recarregar CSS mesmo após retry:', newLink.href);
            // Aplicar estilos inline de emergência quando todos os retries falharem
            if (currentAttempts === MAX_RETRIES - 1) {
              applyEmergencyStyles();
            }
          };
          
          document.head.appendChild(newLink);
          console.log('Tentativa ' + (currentAttempts + 1) + ' de recarregar CSS:', newLink.href);
        } else {
          console.warn('Número máximo de tentativas atingido para:', target.href);
          // Carrega o CSS básico inline como fallback
          applyEmergencyStyles();
        }
      } else {
        // Para erros em estilos inline, aplica estilos de emergência
        applyEmergencyStyles();
      }
    }
  }, true);
  
  // Adiciona um timeout para verificar se a aplicação carregou
  setTimeout(() => {
    const root = document.getElementById('root');
    if (root && (root.children.length === 0 || 
        (root.children.length === 1 && root.firstElementChild && 
         root.firstElementChild.classList.contains('loading-container')))) {
      console.warn('Aplicação não carregou completamente após timeout, aplicando fallbacks');
      
      // Injeta CSS básico de fallback
      applyEmergencyStyles();
      
      // Tenta inicializar a aplicação novamente
      try {
        initApp();
      } catch (error) {
        console.error('Falha na reinicialização de emergência:', error);
      }
    }
  }, 5000);
}

// Função para aplicar estilos de emergência
function applyEmergencyStyles() {
  if (document.getElementById('emergency-styles')) return; // Evita duplicação
  
  const emergencyStyle = document.createElement('style');
  emergencyStyle.id = 'emergency-styles';
  emergencyStyle.textContent = `
    body { 
      font-family: system-ui, -apple-system, sans-serif !important; 
      background-color: white !important; 
      color: black !important; 
      margin: 0 !important;
      padding: 0 !important;
    }
    #root { 
      display: flex !important; 
      flex-direction: column !important; 
      min-height: 100vh !important; 
      padding: 20px !important; 
    }
    .content-container, .app-container { 
      display: flex !important; 
      flex-direction: column !important; 
      flex: 1 !important;
      width: 100% !important;
    }
    .emergency-visible {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    button { 
      cursor: pointer !important; 
      background-color: #16a4e8 !important; 
      color: white !important; 
      border: none !important; 
      border-radius: 8px !important; 
      padding: 10px 20px !important; 
      font-weight: 500 !important;
    }
    h1, h2, h3, h4, h5, h6 { 
      color: #1a1a1a !important; 
      margin-bottom: 1rem !important;
    }
    p, span, a { 
      color: #333 !important;
    }
  `;
  document.head.appendChild(emergencyStyle);
  console.log('Estilos de emergência aplicados');
  
  // Adiciona uma mensagem visível para o usuário
  const root = document.getElementById('root');
  if (root) {
    const message = document.createElement('div');
    message.className = 'emergency-visible';
    message.style.cssText = 'padding: 10px; margin: 10px 0; background-color: #fff8e1; border: 1px solid #ffe082; border-radius: 4px; color: #ff8f00;';
    message.innerHTML = `
      <p>Estamos com problemas para carregar alguns recursos visuais. O sistema continua funcionando normalmente.</p>
    `;
    
    if (!root.querySelector('.emergency-visible')) {
      if (root.firstChild) {
        root.insertBefore(message, root.firstChild);
      } else {
        root.appendChild(message);
      }
    }
  }
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
