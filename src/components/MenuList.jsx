// src/components/MenuList.jsx
import React, { useEffect, useState } from 'react';
import { useMenuApi } from '../api/menuApi';

const MenuList = () => {
  const { getMenus } = useMenuApi();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menus = await getMenus();
        setMenus(menus);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };
    fetchMenus();
  }, [getMenus]);

  return (
    <div>
      <h2>Menús</h2>
      <ul>
        {menus.map((menu) => (
          <li key={menu._id}>
            {menu.name} - {menu.description} - {menu.price} - {menu.categoria} - <img src={menu.imagen} alt={menu.name} width="50" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
