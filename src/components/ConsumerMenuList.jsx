// scr/components/ConsumersMenuList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConsumersMenuList = () => {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const addToCart = (menu) => {
    setCart([...cart, { ...menu, cartItemId: new Date().getTime() }]);
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl border w-[300px] bg-black font-bold text-center text-white my-6 mb-6 fuente1 mx-auto">Lista de Menús (Consumidores)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu._id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl text-center font-bold mb-2 fuente1">{menu.name}</h2>
            <p className="mb-2">{menu.description}</p>
            <p className="mb-2 text-center fuente1 text-xl">${menu.price}</p>
            <p className="mb-2 text-white bg-black rounded text-center">{menu.categoria}</p>
            {menu.imagen && <img src={menu.imagen} alt={menu.name} className="w-full h-32 object-cover rounded mb-2" />}
            <button onClick={() => addToCart(menu)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Agregar al carrito</button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl text-white font-bold mb-4">Carrito de compras</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.cartItemId} className="flex justify-between items-center mb-4">
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(item.cartItemId)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConsumersMenuList;
