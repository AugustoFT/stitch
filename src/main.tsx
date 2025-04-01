
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

// Implementando uma função de retry para CSS falhos
function retryFailedCssLoad() {
  window.addEventListener('error', function(e) {
    // Verifica se o erro está relacionado a carregamento de CSS
    if (e.target && (e.target instanceof HTMLLinkElement || e.target instanceof HTMLStyleElement)) {
      console.warn('Erro ao carregar recurso CSS:', e.target instanceof HTMLLinkElement ? e.target.href : 'inline style');
      
      // Se for um link, tenta recarregar
      if (e.target instanceof HTMLLinkElement && e.target.href) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = e.target.href + '?retry=' + new Date().getTime(); // Adiciona timestamp para evitar cache
        document.head.appendChild(newLink);
        console.log('Tentando recarregar CSS:', newLink.href);
      }
    }
  }, true);
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
