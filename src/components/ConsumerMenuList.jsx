// src/components/ConsumerMenuList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FaTrash } from 'react-icons/fa';
import { useOrderApi } from '../api/orderApi'; // Importa useOrderApi

const ConsumersMenuList = () => {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { addOrder } = useOrderApi(); // Añade addOrder desde useOrderApi

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMenus(response.data);
        const uniqueCategories = new Set(response.data.map(menu => menu.categoria));
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (menu) => {
    const existingItem = cart.find(item => item._id === menu._id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === menu._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...menu, cartItemId: new Date().getTime(), quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find(item => item.cartItemId === cartItemId);
    let updatedCart;
    if (itemToRemove.quantity > 1) {
      updatedCart = cart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCategoryClick = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category);
    } else {
      newSelectedCategories.add(category);
    }
    setSelectedCategories(newSelectedCategories);
  };

  const handleShowAllMenus = () => {
    setSelectedCategories(new Set());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMenus = menus.filter(menu => {
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(menu.categoria);
    const matchesSearchTerm = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const handlePlaceOrder = async () => {
    const orderData = {
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total: getTotalPrice()
    };

    try {
      await addOrder(orderData);
      setCart([]);
      localStorage.removeItem('cart');
      console.log('Pedido enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      infinite: true
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      infinite: true
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      infinite: true
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-4xl w-[300px] bg-black font-bold text-center text-white mb-2 fuente1 mx-auto">
        Menú
      </h1>

      {/* Barra de búsqueda */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar menú..."
          className="px-4 py-2 w-[300px] rounded focus:outline-none focus:ring-0"
        />
      </div>

      {/* Categorías */}
      <div className="mb-4 flex justify-center">
        <Popover className="relative">
          <Popover.Button className="flex flex-col focus:outline-none items-center text-xl text-white bg-black px-4 py-2 rounded hover:border fuente1">
            Categorías
            <ChevronDownIcon className="h-5 w-5 mt-1" />
          </Popover.Button>
          <Popover.Panel className="absolute z-10 text-white bg-black border border-white rounded shadow-lg mt-2 w-48 left-1/2 transform -translate-x-1/2">
            <div className="p-4 flex flex-col space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`text-center px-4 py-2 rounded ${selectedCategories.has(category) ? 'border' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
              <button
                className={`text-center px-4 py-2 rounded ${selectedCategories.size === 0 ? 'border' : ''}`}
                onClick={handleShowAllMenus}
              >
                Mostrar todas
              </button>
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={false}
        infinite={true}
        itemClass="px-4 flex justify-center"
      >
        {filteredMenus.map((menu) => (
          <div key={menu._id} className="bg-white p-4 w-[300px] h-[500px] rounded shadow-md">
            <h2 className="text-xl text-center font-bold mb-2 fuente1">{menu.name}</h2>
            <img src={menu.imagen} alt={menu.name} className="w-full h-32 object-cover rounded mb-2" />
            <p className="mb-2 text-center fuente1 text-xl">${menu.price}</p>        
            <p className="mb-2 h-[180px]">{menu.description}</p>
            <p className="mb-2 text-white bg-black rounded text-center">{menu.categoria}</p>
            <button onClick={() => addToCart(menu)} className=" bg-black text-white px-4 py-2 rounded mt-2 w-full">Agregar a pedidos</button>
          </div>
        ))}
      </Carousel>

      <div className="mt-8">
        <h2 className="text-4xl text-white text-center fuente1 font-bold mb-4">Pedidos</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Tu plato está vacío.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-600">
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-semibold text-white">{item.name} (x{item.quantity})</p>
                    <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.cartItemId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center">
                    <FaTrash /> {/* Usa el icono aquí */}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <p className="text-xl text-white font-semibold">Total: ${getTotalPrice()}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="text-white px-4 py-2 rounded bg-red-500 hover:bg-red-600 "
                onClick={handlePlaceOrder}
              >
                Realizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumersMenuList;
