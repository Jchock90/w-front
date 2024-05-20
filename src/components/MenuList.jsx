import React, { useEffect, useState } from 'react';
import { useMenuApi } from '../api/menuApi';

const MenuList = () => {
  const { getMenus } = useMenuApi();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const data = await getMenus();
      setMenus(data);
    };

    fetchMenus();
  }, [getMenus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Lista de Menús</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-bold mb-2">{menu.name}</h3>
              <p className="text-gray-700 mb-2">{menu.description}</p>
              <p className="text-gray-900 font-bold mb-2">${menu.price}</p>
              <p className="text-gray-500 mb-2">{menu.categoria}</p>
              {menu.imagen && (
                <img src={menu.imagen} alt={menu.name} className="w-full h-48 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuList;
