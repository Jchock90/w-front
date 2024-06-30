// src/components/OrderList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOrderApi } from '../api/orderApi'; // Importa useOrderApi
import { FaTrash } from 'react-icons/fa';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { deleteOrder } = useOrderApi(); // Añade deleteOrder desde useOrderApi

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

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId); // Llama a deleteOrder para eliminar el pedido del servidor
      setOrders(orders.filter(order => order._id !== orderId));
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-white">
      <h1 className="text-4xl font-bold text-center mt-4 mb-4 fuente1">Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-center">Aún no hay pedidos.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {orders.map((order) => (
            <li key={order._id} className="py-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">N° de pedido: {order._id}</h2>
                <div className="flex items-center">
                  <p className="text-white mr-4">Total: ${order.total}</p>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <p>{item.name} (x{item.quantity})</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
