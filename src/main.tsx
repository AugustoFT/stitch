
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Certificando-se de que o elemento root existe antes de renderizar
const rootElement = document.getElementById("root");

if (rootElement) {
  console.log("Montando aplicação React no DOM");
  try {
    createRoot(rootElement).render(<App />);
    console.log("Aplicação React montada com sucesso");
  } catch (error) {
    console.error("Erro ao montar aplicação React:", error);
  }
} else {
  console.error("Elemento root não encontrado no DOM!");
}
