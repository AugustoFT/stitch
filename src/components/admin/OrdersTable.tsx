
import React from 'react';
import { toast } from 'sonner';
import StatusBadge from './StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, filterStatus, updateOrderStatus }) => {
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

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
