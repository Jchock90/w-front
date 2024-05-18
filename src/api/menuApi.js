// src/api/menuApi.js

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/menus';

export const useMenuApi = () => {
  const { token } = useAuth();

  const getMenus = async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const addMenu = async (menuData) => {
    const response = await axios.post(`${API_URL}/add`, menuData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  return { getMenus, addMenu };
};
