import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCashRegister } from 'react-icons/fa';

const PrintedOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closeMessage, setCloseMessage] = useState('');

  const fetchPrintedOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders?printed=true');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching printed orders:', error);
    }
  };

  const closeCashRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders/close-cash-register');
      setCloseMessage(`Caja cerrada exitosamente. Resumen de ventas guardado en: ${response.data.filePath}`);
      setOrders([]); // Limpiar las órdenes después de cerrar la caja
    } catch (error) {
      console.error('Error al cerrar la caja:', error);
    }
  };

  useEffect(() => {
    fetchPrintedOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-white">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mt-4 mb-4 fuente1">Caja</h1>
        {closeMessage && (
          <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
            {closeMessage}
          </div>
        )}
        {orders.length === 0 ? (
          <p className="text-center">Aún no hay pedidos.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {orders.map((order) => (
              <li key={order._id} className="py-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">N° de pedido: {order.orderNumber}</h2>
                </div>
                <p className="text-gray-500 mb-2">Origen: {order.source}</p>

                <ul className="divide-y divide-gray-200 mb-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="py-2 flex justify-between">
                      <p>{item.name} (x{item.quantity})</p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold text-right mt-4">
                  Total: <span className="text-green-500">${order.total.toFixed(2)}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={closeCashRegister}
          className="bg-green-500 hover:bg-green-700 text-white rounded fuente1 text-xl p-2 mb-4"
        >
         Cerrar Caja
        </button>
      </div>
    </div>
  );
};

export default PrintedOrderList;
