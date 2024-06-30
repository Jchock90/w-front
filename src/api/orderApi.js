// src/api/orderApi.js

// src/api/orderApi.js
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/orders';

export const useOrderApi = () => {
  const { token } = useAuth();

  const getOrders = async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const addOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/add`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const deleteOrder = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  return { getOrders, addOrder, deleteOrder };
};