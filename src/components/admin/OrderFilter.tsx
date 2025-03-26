
import React from 'react';

interface OrderFilterProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ filterStatus, setFilterStatus }) => {
  return (
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
        <option value="paid">Pagos</option>
        <option value="shipped">Enviados</option>
        <option value="delivered">Entregues</option>
        <option value="cancelled">Cancelados</option>
      </select>
    </div>
  );
};

export default OrderFilter;
