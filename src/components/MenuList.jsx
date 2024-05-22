import React, { useEffect, useState } from 'react';
import { useMenuApi } from '../api/menuApi';
import AddMenu from './AddMenu';

const MenuList = () => {
  const { getMenus, deleteMenu } = useMenuApi();
  const [menus, setMenus] = useState([]);
  const [menuToEdit, setMenuToEdit] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      const data = await getMenus();
      setMenus(data);
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
    // Refetch menus after update
    getMenus().then(data => setMenus(data));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lista de Menús</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu._id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{menu.name}</h2>
            <p className="mb-2">{menu.description}</p>
            <p className="mb-2">${menu.price}</p>
            <p className="mb-2">{menu.categoria}</p>
            {menu.imagen && <img src={menu.imagen} alt={menu.name} className="w-full h-32 object-cover rounded mb-2" />}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
              onClick={() => handleDelete(menu._id)}
            >
              Eliminar
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => handleEdit(menu)}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
      {menuToEdit && <AddMenu menuToEdit={menuToEdit} onMenuUpdated={handleMenuUpdated} />}
    </div>
  );
};

export default MenuList;
