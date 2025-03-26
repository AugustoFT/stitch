
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import AdminLogin from '../components/admin/AdminLogin';
import OrdersTable from '../components/admin/OrdersTable';
import OrderFilter from '../components/admin/OrderFilter';
import { loadOrders, updateOrderStatus } from '../services/orderService';

interface LocalOrder {
  id: string;
  date: string;
  customer: string;
  address: string;
  products: string[];
  total: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load orders from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const loadedOrders = loadOrders();
      setOrders(loadedOrders);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateOrderStatus = (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid') => {
    const success = updateOrderStatus(id, status);
    
    if (success) {
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      
      const statusLabel = (() => {
        switch (status) {
          case 'pending': return 'Pendente';
          case 'shipped': return 'Enviado';
          case 'delivered': return 'Entregue';
          case 'cancelled': return 'Cancelado';
          case 'paid': return 'Pago';
          default: return status;
        }
      })();
      
      toast.success(`Pedido #${id.substring(0, 6)} atualizado para ${statusLabel}`);
    } else {
      toast.error('Erro ao atualizar status do pedido');
    }
  };

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
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
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
              
              <OrderFilter 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>
            
            <OrdersTable 
              orders={orders}
              filterStatus={filterStatus}
              updateOrderStatus={handleUpdateOrderStatus}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
