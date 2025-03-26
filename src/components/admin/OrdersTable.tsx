
import React, { useState } from 'react';
import { toast } from 'sonner';
import StatusBadge from './StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface LocalOrder {
  id: string;
  date: string;
  customer: string;
  address: string;
  products: string[];
  total: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
}

interface OrdersTableProps {
  orders: LocalOrder[];
  filterStatus: string;
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid') => void;
  deleteOrder?: (id: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  filterStatus, 
  updateOrderStatus,
  deleteOrder 
}) => {
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);
    
  const handleDeleteOrder = (id: string) => {
    if (deleteOrder) {
      deleteOrder(id);
      toast.success(`Pedido #${id.substring(0, 6)} excluído com sucesso`);
    }
    setOrderToDelete(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">#{order.id.substring(0, 6)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div>{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.address}</div>
                  </TableCell>
                  <TableCell>
                    <ul>
                      {order.products.map((product, idx) => (
                        <li key={idx}>{product}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-stitch-blue focus:ring focus:ring-stitch-blue/20"
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            onClick={() => setOrderToDelete(order.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Excluir pedido"
                          >
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o pedido #{order.id.substring(0, 6)}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
