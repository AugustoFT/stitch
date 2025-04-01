
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Iniciando aplicação...");

// Certificando-se de que o elemento root existe antes de renderizar
const rootElement = document.getElementById("root");

if (rootElement) {
  console.log("Elemento root encontrado, iniciando renderização");
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Aplicação React montada com sucesso");
  } catch (error) {
    console.error("Erro crítico ao montar aplicação React:", error);
    // Tentativa de exibir erro visualmente para o usuário
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; text-align: center;">
        <h2>Erro ao carregar aplicação</h2>
        <p>${error?.message || 'Erro desconhecido'}</p>
      </div>
    `;
  }
} else {
  console.error("ERRO CRÍTICO: Elemento root não encontrado no DOM!");
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center;">
      <h2>Erro crítico</h2>
      <p>Elemento root não encontrado. Por favor, recarregue a página.</p>
    </div>
  `;
}
