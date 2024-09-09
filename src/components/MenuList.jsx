// src/components/MenuList.jsx
import React, { useEffect, useState } from 'react';
import { useMenuApi } from '../api/menuApi';
import AddMenu from './AddMenu';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 text-white p-3 cursor-pointer z-10"
    style={{ fontSize: '30px' }}
    onClick={onClick}
  >
    &#9654;
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 text-white p-3 cursor-pointer z-10"
    style={{ fontSize: '30px' }}
    onClick={onClick}
  >
    &#9664;
  </div>
);

const MenuList = () => {
  const { getMenus, editMenu, deleteMenu } = useMenuApi();
  const [menus, setMenus] = useState([]);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [percentage, setPercentage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      const data = await getMenus();
      setMenus(data);
    };

    fetchMenus();
  }, [getMenus]);

  const applyPercentage = async () => {
    if (!percentage) return;

    try {
      const newMenus = menus.map(menu => {
        const newPrice = parseFloat(menu.price) * (1 + parseFloat(percentage) / 100);
        return { ...menu, price: newPrice.toFixed(2) };
      });

      await Promise.all(newMenus.map(menu => editMenu(menu._id, { price: menu.price })));

      setMenus(newMenus);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000); // Oculta el modal de éxito después de 2 segundos
    } catch (err) {
      console.error('Error al aplicar el porcentaje:', err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000); // Oculta el modal de error después de 2 segundos
    }
  };

  const handleEdit = (menu) => {
    setMenuToEdit(menu);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
      setMenus(menus.filter(menu => menu._id !== id));
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (err) {
      console.error('Error al eliminar el menú:', err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    }
  };

  const confirmDeleteMenu = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (menuToDelete) {
      handleDelete(menuToDelete._id);
    }
    setShowDeleteConfirmModal(false);
    setMenuToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setMenuToDelete(null);
  };

  const handleMenuUpdated = () => {
    setMenuToEdit(null);
    getMenus().then((data) => setMenus(data));
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const filteredMenus = menus.filter((menu) => {
    return (
      menu.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!categoryFilter || menu.categoria === categoryFilter)
    );
  });

  // Obtener lista única de categorías
  const categories = Array.from(new Set(menus.map((menu) => menu.categoria)));

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="relative">
      <h1 className="text-4xl w-[300px] bg-black font-bold text-center text-white mt-2  mb-2 fuente1 mx-auto">
        Lista de Menús
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center mb-3 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded px-4 py-2 w-64 md:w-auto bg-black text-white focus:outline-none focus:ring-0"
        />
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="border rounded px-4 py-2 w-64 md:w-auto bg-black text-white focus:outline-none focus:ring-0"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Input para porcentaje y botón de aplicar */}
        <div className="flex items-center space-x-4">
          <input
            type="number"
            placeholder="Porcentaje (%)"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="border rounded px-4 py-2 w-32 bg-black text-white focus:outline-none focus:ring-0"
          />
          <button
            onClick={applyPercentage}
            className="text-white text-xl bg-green-500 px-3 py-2 rounded hover:bg-green-600 fuente1"
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="relative">
        <Slider {...settings} className="mx-4">
          {filteredMenus.map((menu) => (
            <div key={menu._id} className="px-1">
              <div className="bg-black border p-4 rounded-lg shadow-lg w-[300px] h-[400px] mx-auto">
                <h2 className="text-xl text-white text-center font-bold mb-2 fuente1">
                  {menu.name}
                </h2>
                {menu.imagen && (
                  <img
                    src={menu.imagen}
                    alt={menu.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <div className="text-black mb-2 text-white text-sm max-h-[100px] overflow-y-auto">
                  {menu.description}
                </div>
                <p className="text-center fuente1 text-white text-lg font-semibold mb-2">
                  ${menu.price}
                </p>
                <p className="text-center bg-white text-black bg-black rounded py-1 px-3 mb-2 fuente1">
                  {menu.categoria}
                </p>
                <div className="flex justify-between">
                  <button
                    className="text-white text-xl bg-green-500 px-3 py-2 rounded hover:bg-green-600 block fuente1"
                    onClick={() => handleEdit(menu)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-white text-xl bg-red-500 px-3 py-2 rounded hover:bg-red-600 block fuente1"
                    onClick={() => confirmDeleteMenu(menu)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {menuToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black border p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMenuToEdit(null)}
            >
              &times;
            </button>
            <AddMenu menuToEdit={menuToEdit} onMenuUpdated={handleMenuUpdated} />
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-green-500 mb-4">¡Operación exitosa!</h3>
            <p className="text-gray-700">
              {menuToDelete
                ? 'El menú ha sido eliminado correctamente.'
                : 'Los precios han sido actualizados correctamente.'}
            </p>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">¡Error!</h3>
            <p className="text-gray-700">Ha ocurrido un error. Por favor, intenta nuevamente.</p>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">¿Estás seguro?</h3>
            <p className="text-gray-700 mb-4">¿Realmente deseas eliminar este menú?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Sí
              </button>
              <button
                className="text-white bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
