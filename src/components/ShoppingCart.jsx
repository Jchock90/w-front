// src/components/ShoppingCart.jsx

import React from 'react';

const ShoppingCart = ({ cart, removeFromCart }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Carrito de compras</h2>
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
            <button onClick={() => removeFromCart(item._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;
