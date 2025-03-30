
import React, { useEffect } from 'react';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    fbq: any;
  }
}

const Footer: React.FC = () => {
  useEffect(() => {
    // Ensure Meta Pixel is loaded and fire a PageView event
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <footer className="py-8 px-6 md:px-12 mt-12 bg-stitch-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-display font-bold mb-2 text-stitch-blue">Lilo & Stitch</h3>
        </div>
        
        {/* Security Seals Section - Now positioned above the Links */}
        <div className="mb-8 pb-4 border-b border-gray-700">
          <h4 className="font-medium mb-4 text-center text-stitch-yellow">Site Seguro</h4>
          <div className="flex flex-wrap justify-center gap-6 mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-2 mb-2">
                <ShieldCheck className="h-8 w-8 text-green-400" />
              </div>
              <span className="text-xs text-gray-300">Site Seguro</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-2 mb-2">
                <CreditCard className="h-8 w-8 text-green-400" />
              </div>
              <span className="text-xs text-gray-300">Pagamento Seguro</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-2 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xs text-gray-300">Dados Protegidos</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-2 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="currentColor"/>
                  <path d="M18 21C19.1046 21 20 20.1046 20 19C20 17.8954 19.1046 17 18 17C16.8954 17 16 17.8954 16 19C16 20.1046 16.8954 21 18 21Z" fill="currentColor"/>
                  <path d="M18 14C15.79 14 14 15.79 14 18C14 18.7 14.18 19.37 14.5 19.94C15.19 19.38 16.31 19 18 19C19.69 19 20.81 19.38 21.5 19.94C21.82 19.37 22 18.7 22 18C22 15.79 20.21 14 18 14Z" fill="currentColor"/>
                  <path d="M12 13C9.33 13 4 14.34 4 17V20H12.08C12.03 19.67 12 19.34 12 19C12 17.77 12.39 16.64 13.05 15.74C13.97 15.31 15.27 15 17 15C19.03 15 20.15 15.44 20.66 15.79C20.88 15.19 21 14.62 21 14H21C21 14 21 13 12 13Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xs text-gray-300">Autenticação</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            {/* This space is now empty as the Lilo & Stitch title was moved up */}
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <h4 className="font-medium mb-2 text-stitch-yellow">Links Rápidos</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Início</a></li>
                <li><a href="#produto" className="text-gray-300 hover:text-white transition-colors">Produto</a></li>
                <li><a href="#detalhes" className="text-gray-300 hover:text-white transition-colors">Detalhes</a></li>
                <li><a href="#checkout" className="text-gray-300 hover:text-white transition-colors">Checkout</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-stitch-yellow">Suporte</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Lilo & Stitch. Todos os direitos reservados.</p>
          
          <div className="flex justify-center mt-4">
            <Link 
              to="/admin" 
              className="text-gray-500 hover:text-stitch-blue transition-colors p-2"
              title="Área de Administração"
            >
              <Lock size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
