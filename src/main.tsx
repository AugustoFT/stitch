
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced function to identify and fix CSS loading issues
const handleCssLoadingError = () => {
  // Create emergency fallback styles in case CSS fails to load
  const createFallbackStyles = () => {
    console.warn('Creating emergency fallback styles to prevent blank screen');
    const fallbackStyles = document.createElement('style');
    fallbackStyles.textContent = `
      /* Emergency fallback styles */
      body { 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        background: #f5f8fd;
        color: #333;
        line-height: 1.5;
      }
      .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem; }
      .text-center { text-align: center; }
      h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
      p { margin-bottom: 1em; }
      a { color: #16a4e8; text-decoration: none; }
      a:hover { text-decoration: underline; }
      button, .btn { 
        display: inline-block; 
        padding: 0.5rem 1.5rem; 
        background: #ff4c8f; 
        color: white; 
        border: none;
        border-radius: 9999px; 
        cursor: pointer;
        font-weight: 500;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      button:hover, .btn:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      img { max-width: 100%; height: auto; }
      .card { 
        border-radius: 8px; 
        overflow: hidden;
        padding: 1rem; 
        margin: 1rem 0; 
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      /* Basic grid system */
      .grid { display: grid; gap: 1rem; }
      @media (min-width: 768px) {
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
      }
    `;
    document.head.appendChild(fallbackStyles);
  };

  // Apply retries with exponential backoff for CSS loading
  const retryCssLoad = (url, maxRetries = 3, retryDelay = 1000) => {
    let retryCount = 0;
    
    const attemptLoad = () => {
      if (retryCount >= maxRetries) {
        console.error(`Failed to load CSS after ${maxRetries} attempts: ${url}`);
        // If all retries fail, create fallback styles
        createFallbackStyles();
        return;
      }
      
      retryCount++;
      console.warn(`Attempt ${retryCount} to load CSS: ${url}`);
      
      const retryLink = document.createElement('link');
      retryLink.rel = 'stylesheet';
      retryLink.href = url.includes('?') 
        ? `${url}&retry=${Date.now()}` 
        : `${url}?retry=${Date.now()}`;
      
      retryLink.onerror = () => {
        console.warn(`Retry ${retryCount} failed, trying again in ${retryDelay}ms`);
        setTimeout(attemptLoad, retryDelay * retryCount); // Exponential backoff
      };
      
      document.head.appendChild(retryLink);
    };
    
    attemptLoad();
  };

  // Event listener for CSS loading errors
  document.addEventListener('error', (event) => {
    const target = event.target;
    
    // Type guard for HTML elements
    if (!(target instanceof HTMLElement)) return;
    
    // Handle CSS loading errors
    if (target instanceof HTMLLinkElement && 
        target.rel === 'stylesheet' && 
        target.href) {
        
      console.warn(`Error loading CSS: ${target.href}`);
      event.preventDefault(); // Prevent default error handling
      
      try {
        // Extract base URL without query parameters
        const baseUrl = target.href.split('?')[0];
        
        // Attempt to retry loading the CSS
        retryCssLoad(baseUrl);
      } catch (error) {
        console.error('Error in CSS retry logic:', error);
        createFallbackStyles(); // Fallback if retry logic fails
      }
    }
  }, true); // Use capture phase to catch errors early
  
  // Immediately apply fallback styles with a delay to ensure they get applied
  // even if the event listener setup fails
  setTimeout(createFallbackStyles, 3000);
};

// Initialize CSS error handling
handleCssLoadingError();

// Safely mount the application
const mountApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found, creating a new one');
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    
    try {
      createRoot(newRoot).render(<App />);
    } catch (error) {
      console.error('Error rendering app to new root:', error);
      renderFallbackUI(newRoot);
    }
    return;
  }
  
  try {
    createRoot(rootElement).render(<App />);
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Error rendering application:', error);
    renderFallbackUI(rootElement);
  }
};

// Render fallback UI if app fails to mount
const renderFallbackUI = (element) => {
  element.innerHTML = `
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
};

// Start the app when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
