
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Improved CSS error handling function
const handleCssLoadingErrors = () => {
  const createFallbackStyles = () => {
    console.warn('Aplicando estilos de fallback para evitar tela em branco');
    document.body.classList.add('css-loading-error');
    
    // Create error notification element
    const errorNotification = document.createElement('div');
    errorNotification.id = 'css-error-notification';
    errorNotification.className = 'visible';
    errorNotification.textContent = 'Erro ao carregar estilos. Alguns recursos visuais podem estar indisponíveis.';
    document.body.appendChild(errorNotification);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      errorNotification.className = '';
      setTimeout(() => errorNotification.remove(), 300);
    }, 5000);
  };

  // Listen for CSS loading errors
  window.addEventListener('error', (event) => {
    if (event.target && 
        event.target instanceof HTMLLinkElement && 
        event.target.rel === 'stylesheet') {
      console.warn('Erro ao carregar CSS:', event);
      event.preventDefault();
      createFallbackStyles();
    }
  }, true);
  
  // Set a timeout to check if styles have loaded properly
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(document.body);
    const hasStyles = computedStyle.backgroundColor !== '' && 
                     computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
    
    if (!hasStyles) {
      console.warn('Possível problema de carregamento CSS detectado');
      createFallbackStyles();
    }
  }, 2000);
};

// Initialize CSS error handling
handleCssLoadingErrors();

// Mount the application
const mountApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Elemento root não encontrado, criando novo elemento');
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    
    try {
      createRoot(newRoot).render(<App />);
    } catch (error) {
      console.error('Erro ao renderizar app:', error);
      newRoot.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
          <h1 style="color: #16a4e8;">Ops! Algo deu errado.</h1>
          <p>Estamos enfrentando dificuldades técnicas. Por favor, tente recarregar a página.</p>
          <button onclick="window.location.reload()" 
                  style="background: linear-gradient(to right, #ff4c8f, #ff8c6b); color: white; border: none; 
                         padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 500; 
                         cursor: pointer; margin-top: 1rem;">
            Recarregar Página
          </button>
        </div>
      `;
    }
    return;
  }
  
  try {
    createRoot(rootElement).render(<App />);
    console.log('Aplicação renderizada com sucesso');
  } catch (error) {
    console.error('Erro ao renderizar aplicação:', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1 style="color: #16a4e8;">Ops! Algo deu errado.</h1>
        <p>Estamos enfrentando dificuldades técnicas. Por favor, tente recarregar a página.</p>
        <button onclick="window.location.reload()" 
                style="background: linear-gradient(to right, #ff4c8f, #ff8c6b); color: white; border: none; 
                       padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 500; 
                       cursor: pointer; margin-top: 1rem;">
          Recarregar Página
        </button>
      </div>
    `;
  }
};

// Start the app when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
