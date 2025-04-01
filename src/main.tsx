
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Iniciando aplicação...");

// Função auxiliar para exibir erros na tela
function displayError(element, error) {
  console.error("Erro na aplicação:", error);
  element.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center; font-family: sans-serif;">
      <h2>Erro ao carregar aplicação</h2>
      <p>${error?.message || 'Erro desconhecido'}</p>
      <button onclick="window.location.reload()" 
              style="margin-top: 20px; padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Tentar novamente
      </button>
    </div>
  `;
}

// Inicialização da aplicação com mais verificações de erro
function initApp() {
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
