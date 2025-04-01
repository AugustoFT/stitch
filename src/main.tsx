
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the root element exists before rendering
const rootElement = document.getElementById("root");

if (rootElement) {
  // Log successful mounting
  console.log("Mounting React app to DOM");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found in DOM");
}
