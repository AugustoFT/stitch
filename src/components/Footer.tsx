
import React from 'react';

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
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Lilo & Stitch. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
