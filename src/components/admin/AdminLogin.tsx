
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '@bright011') {
      onLoginSuccess();
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Usuário ou senha incorretos');
    }
  };

  return (
    <motion.div 
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-stitch-blue/10 rounded-full">
          <Lock className="h-8 w-8 text-stitch-blue" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Área de Administração
      </h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-stitch-blue focus:border-stitch-blue"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-stitch-blue focus:border-stitch-blue"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <motion.button
          type="submit"
          className="w-full bg-stitch-blue text-white py-2 rounded-md shadow hover:bg-stitch-blue/90 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Entrar
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AdminLogin;
