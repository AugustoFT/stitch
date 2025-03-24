
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Order {
  id: string;
  date: string;
  customer: string;
  address: string;
  products: string[];
  total: string;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
}

const mockOrders: Order[] = [
  {
    id: '001',
    date: '2023-05-10',
    customer: 'Maria Silva',
    address: 'Rua das Flores, 123, São Paulo - SP',
    products: ['Pelúcia Stitch'],
    total: 'R$ 139,99',
    status: 'delivered'
  },
  {
    id: '002',
    date: '2023-05-15',
    customer: 'João Oliveira',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    products: ['Óculos Stitch', 'Pelúcia Stitch'],
    total: 'R$ 269,98',
    status: 'shipped'
  },
  {
    id: '003',
    date: '2023-05-20',
    customer: 'Ana Souza',
    address: 'Rua Augusta, 500, São Paulo - SP',
    products: ['Kit Completo Stitch'],
    total: 'R$ 399,98',
    status: 'pending'
  }
];

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'stitch123') {
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const updateOrderStatus = (id: string, status: 'pending' | 'shipped' | 'delivered' | 'canceled') => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
    toast.success(`Pedido #${id} atualizado para ${getStatusLabel(status)}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header 
        className="py-4 px-6 md:px-12 flex justify-between items-center bg-white shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="font-display text-xl text-stitch-blue font-semibold">Lilo e Stitch</div>
        </Link>
        
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-stitch-pink transition-colors flex items-center gap-1"
          >
            <X size={16} />
            Sair
          </button>
        )}
      </motion.header>
      
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
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
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Para fins de demonstração, use:</p>
              <p className="font-medium">Usuário: admin / Senha: stitch123</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Gerenciamento de Pedidos
              </h1>
              
              <div className="flex items-center space-x-3">
                <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                  Filtrar:
                </label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-stitch-blue focus:ring focus:ring-stitch-blue/20"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendentes</option>
                  <option value="shipped">Enviados</option>
                  <option value="delivered">Entregues</option>
                  <option value="canceled">Cancelados</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{order.customer}</div>
                            <div className="text-xs text-gray-400">{order.address}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <ul>
                              {order.products.map((product, idx) => (
                                <li key={idx}>{product}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-stitch-blue focus:ring focus:ring-stitch-blue/20"
                            >
                              <option value="pending">Pendente</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregue</option>
                              <option value="canceled">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Nenhum pedido encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
