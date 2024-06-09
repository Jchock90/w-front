// src/components/ConsumerMenuList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
    const existingItem = cart.find(item => item._id === menu._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === menu._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...menu, cartItemId: new Date().getTime(), quantity: 1 }]);
    }
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find(item => item.cartItemId === cartItemId);
    if (itemToRemove.quantity > 1) {
      setCart(cart.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCart(cart.filter((item) => item.cartItemId !== cartItemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Define las opciones de respuesta para el carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      infinite: true // Hacer el carousel infinito en el escritorio
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      infinite: true // Hacer el carousel infinito en la tableta
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      infinite: true // Hacer el carousel infinito en el móvil
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl border w-[300px] bg-black font-bold text-center text-white my-6 mb-6 fuente1 mx-auto">Lista de Menús</h1>
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        itemClass="px-4" // Hacer el carousel infinito globalmente
      >
        {menus.map((menu) => (
          <div key={menu._id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl text-center font-bold mb-2 fuente1">{menu.name}</h2>
            <p className="mb-2">{menu.description}</p>
            <p className="mb-2 text-center fuente1 text-xl">${menu.price}</p>
            <p className="mb-2 text-white bg-black rounded text-center">{menu.categoria}</p>
            {menu.imagen && <img src={menu.imagen} alt={menu.name} className="w-full h-32 object-cover rounded mb-2" />}
            <button onClick={() => addToCart(menu)} className="bg-black text-white px-4 py-2 rounded mt-2 w-full">Agregar al carrito</button>
          </div>
        ))}
      </Carousel>
      <div className="mt-8">
        <h2 className="text-2xl text-white text-center fuente1 font-bold mb-4">Carrito de compras</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">El carrito está vacío.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-600">
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-semibold text-white">{item.name} (x{item.quantity})</p>
                    <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.cartItemId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <p className="text-xl text-white font-semibold">Total: ${getTotalPrice()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumersMenuList;
 