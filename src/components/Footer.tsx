
import React from 'react';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 md:px-12 mt-12 bg-stitch-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-display font-bold mb-2 text-stitch-blue">Lilo & Stitch</h3>
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
        
        {/* Security Seals Section */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <h4 className="font-medium mb-4 text-stitch-yellow">Site Seguro</h4>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-xs text-gray-300">Site Seguro</span>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-xs text-gray-300">Pagamento Seguro</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-1 mb-2">
                <img 
                  src="https://logodownload.org/wp-content/uploads/2017/11/google-safe-browsing-logo.png" 
                  alt="Google Safe Browsing" 
                  className="h-6 w-auto"
                />
              </div>
              <span className="text-xs text-gray-300">Google Safe Browsing</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-1 mb-2">
                <img 
                  src="https://cdn.awsli.com.br/production/static/img/estrutura/selos-loja/google-safebrowsing.png" 
                  alt="SSL Seguro" 
                  className="h-6 w-auto"
                />
              </div>
              <span className="text-xs text-gray-300">SSL Seguro</span>
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
