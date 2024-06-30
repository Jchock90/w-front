// src/components/MenuList.jsx
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useMenuApi } from '../api/menuApi';
import AddMenu from './AddMenu';

const MenuList = () => {
  const { getMenus, deleteMenu } = useMenuApi();
  const [menus, setMenus] = useState([]);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      const data = await getMenus();
      setMenus(data);
      const uniqueCategories = new Set(data.map(menu => menu.categoria));
      setCategories(Array.from(uniqueCategories));
    };

    fetchMenus();
  }, [getMenus]);

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
      setMenus(menus.filter(menu => menu._id !== id));
    } catch (err) {
      console.error('Error al eliminar el menú:', err);
    }
  };

  const handleEdit = (menu) => {
    setMenuToEdit(menu);
  };

  const handleMenuUpdated = () => {
    setMenuToEdit(null);
    getMenus().then(data => setMenus(data));
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

  const categorizedMenus = filteredMenus.reduce((acc, menu) => {
    acc[menu.categoria] = acc[menu.categoria] || [];
    acc[menu.categoria].push(menu);
    return acc;
  }, {});

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
    <div className="max-w-6xl mx-auto px-4 py-4 bg-black min-h-screen text-gray-300">
      <h1 className="text-4xl w-[300px] bg-black font-bold text-center text-white mb-2 fuente1 mx-auto">
        Lista de Menús
      </h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar menú..."
          className="px-4 py-2 w-[300px] rounded focus:outline-none focus:ring-0"
        />
      </div>

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

      {Object.keys(categorizedMenus).map((categoria) => (
        <div key={categoria}>
          <h2 className="text-3xl font-bold text-center text-white my-6 fuente1">{categoria}</h2>
          <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={false}
            infinite={true}
            itemClass="px-4 flex justify-center"
            
          >
            {categorizedMenus[categoria].map((menu) => (
              <div key={menu._id} className="bg-white p-4 w-[300px] h-[500px] rounded shadow-md">
                <h2 className="text-xl text-center text-black font-bold mb-2 fuente1">{menu.name}</h2>
                {menu.imagen && (
                  <img
                    src={menu.imagen}
                    alt={menu.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="mb-2 text-center text-black fuente1 text-xl">${menu.price}</p>
                <p className="mb-2 text-black h-[180px]">{menu.description}</p>
                <p className="mb-2 text-white bg-black rounded text-center">{menu.categoria}</p>
                <div className="flex justify-between mt-auto">
                  <button
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleEdit(menu)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(menu._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ))}
      {menuToEdit && <AddMenu menuToEdit={menuToEdit} onMenuUpdated={handleMenuUpdated} />}
    </div>
  );
};

export default MenuList;
