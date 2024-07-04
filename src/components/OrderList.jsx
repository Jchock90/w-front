// src/components/OrderList.jsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useOrderApi } from '../api/orderApi';
import { FaTrash, FaPrint } from 'react-icons/fa';
import PrintOrder from './PrintOrder';
import TableView from './TableView'; // Importar el nuevo componente

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { deleteOrder } = useOrderApi();
  const printRefs = useRef([]);

  useEffect(() => {
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

    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);

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

  const handlePrintOrder = (index) => {
    const printContent = printRefs.current[index];
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Recargar para volver a la vista original
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-white m-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mt-4 mb-4 fuente1">Pedidos</h1>
          {orders.length === 0 ? (
            <p className="text-center">Aún no hay pedidos.</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {orders.map((order, index) => (
                <li key={order._id} className="py-4 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">N° de pedido: {order._id}</h2>
                    <div className="flex items-center space-x-4">
                      <p className="text-white mr-4">Total: ${order.total}</p>
                      <button
                        onClick={() => handlePrintOrder(index)}
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
                  <p className="text-gray-500">Origen: {order.source}</p>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <p>{item.name} (x{item.quantity})</p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                  <PrintOrder ref={el => (printRefs.current[index] = el)} order={order} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mt-4 mb-4 fuente1">Mesas</h1>
          <TableView />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
