// src/components/OrderList.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useOrderApi } from '../api/orderApi';
import { FaTrash, FaPrint } from 'react-icons/fa';
import PrintOrder from './PrintOrder';
import TableView from './TableView';
import './OrderList.css';  // Importa el archivo CSS personalizado

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { deleteOrder } = useOrderApi();
  const printRefs = useRef([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling cada 5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };

  const handlePrintOrder = async (index, orderId) => {
    const printContent = printRefs.current[index].outerHTML;

    try {
      await axios.patch(`http://localhost:5000/api/orders/print/${orderId}`);
      
      const afterPrint = () => {
        window.removeEventListener('afterprint', afterPrint);
        window.location.reload(); // Recargar la página después de la impresión
      };

      window.addEventListener('afterprint', afterPrint, { once: true });
      document.body.innerHTML = printContent;
      window.print();
    } catch (error) {
      console.error('Error al marcar como impresa la orden:', error);
    }
  };

  const formatSource = (source) => {
    return source.replace(/consumers(\d+)/, 'Mesa $1');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mt-2 mb-10 fuente1">Pedidos</h1>
          {orders.length === 0 ? (
            <p className="text-center text-xl">Aún no hay pedidos.</p>
          ) : (
            <div className="orders-container overflow-x-auto w-full">
              <ul className="flex space-x-4">
                {orders.map((order, index) => (
                  <li key={order._id} className="py-4 flex-shrink-0 w-[220px] bg-black border p-4 rounded-lg shadow-lg h-80 flex flex-col justify-between">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-xl font-bold">N° de pedido: {order.orderNumber}</h2>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handlePrintOrder(index, order._id)}
                              className="bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2"
                            >
                              <FaPrint />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 mb-2">Origen: {formatSource(order.source)}</p>
                      </div>
                      <ul className="divide-y divide-gray-200 mb-2 overflow-y-auto max-h-32">
                        {order.items.map((item, index) => (
                          <li key={index} className="py-2 flex justify-between">
                            <p>{item.name} (x{item.quantity})</p>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto">
                      <p className="text-xl font-bold text-right">
                        Total: <span className="text-green-500">${order.total.toFixed(2)}</span>
                      </p>
                    </div>
                    <PrintOrder ref={el => (printRefs.current[index] = el)} order={order} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mt-2 mb-4 fuente1">Mesas</h1>
          <TableView />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
