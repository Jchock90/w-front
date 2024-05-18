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
          <li key={menu._id}>{menu.name} - {menu.description} - {menu.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
