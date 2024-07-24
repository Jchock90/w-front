// src/components/ConsumerMenuList1.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useOrderApi } from '../api/orderApi';

const ConsumerMenuList1 = () => {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const { addOrder } = useOrderApi();

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

    const storedCart = localStorage.getItem('cart1'); // Modificar el almacenamiento del carrito
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
    localStorage.setItem('cart1', JSON.stringify(updatedCart));  // Modificar el almacenamiento del carrito
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
    localStorage.setItem('cart1', JSON.stringify(updatedCart));  // Modificar el almacenamiento del carrito
  };

  const getTotalItemsInCart = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
      total: getTotalPrice(),
      source: 'Consumers1'  // Añadir el origen del pedido
    };

    try {
      await addOrder(orderData);
      setCart([]);
      localStorage.removeItem('cart1');  // Modificar el almacenamiento del carrito
      closeModal();
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-4xl w-[300px] bg-black font-bold text-center text-white mb-2 fuente1 mx-auto">
        Menú
      </h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar menú..."
          className="px-4 py-2 w-[300px] text-white bg-black border rounded focus:outline-none focus:ring-0"
        />
      </div>

      <div className="mb-4 flex justify-center items-center relative w-full">
        <Popover className="relative">
          <Popover.Button className="flex flex-col focus:outline-none items-center text-xl text-white bg-black px-4 py-2 rounded w-[150px]">
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
        <div className="absolute right-[calc(50%_-_150px)] flex items-center">
          <button onClick={openModal} className="text-black bg-white rounded-full p-2 focus:outline-none relative">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-[-10px] right-[-10px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {getTotalItemsInCart()}
              </span>
            )}
          </button>
        </div>
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
          <div key={menu._id} className="bg-black border p-2 w-[300px] h-[400px] rounded shadow-md">
            <h2 className="text-xl text-white text-center font-bold mb-2 fuente1">{menu.name}</h2>
            <img src={menu.imagen} alt={menu.name} className="w-full h-32 object-cover rounded mb-2" />
            <p className="mb-2 text-white text-center fuente1 text-xl">${menu.price}</p>        
            <div className="mb-2 h-[100px] text-white overflow-y-auto">{menu.description}</div>
            <p className="mb-2 text-black bg-white rounded text-center">{menu.categoria}</p>
            <button onClick={() => addToCart(menu)} className=" bg-black border text-white text-xl px-3 py-1 rounded fuente1 w-full">Agregar a tu mesa</button>
          </div>
        ))}
      </Carousel>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-black w-[350px] h-[500px] rounded shadow-md p-4 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-white">
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-white text-center fuente1">Pedidos en tu mesa</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center">Tu mesa está vacía.</p>
            ) : (
              <div className="flex flex-col h-[420px] justify-between">
                <div className="flex-grow overflow-y-auto">
                  <ul className="divide-y divide-gray-600">
                    {cart.map((item) => (
                      <li key={item.cartItemId} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-semibold text-white">{item.name} (x{item.quantity})</p>
                          <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center justify-center">
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul> 
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-white text-m text-sm px-3 py-1 rounded bg-red-500 fuente1 hover:bg-red-600"
                    onClick={handlePlaceOrder}
                  >
                    Realizar Pedido
                  </button>
                  <p className="text-lg font-semibold text-white">Total: ${getTotalPrice()}</p>
                </div>
                
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerMenuList1;
