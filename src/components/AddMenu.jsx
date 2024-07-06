// src/components/AddMenu.jsx

import React, { useState, useEffect } from 'react';
import { useMenuApi } from '../api/menuApi';

const AddMenu = ({ menuToEdit, onMenuUpdated }) => {
  const { addMenu, editMenu } = useMenuApi();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (menuToEdit) {
      setName(menuToEdit.name);
      setDescription(menuToEdit.description);
      setPrice(menuToEdit.price);
      setCategoria(menuToEdit.categoria);
      setImagen(menuToEdit.imagen);
    }
  }, [menuToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (menuToEdit) {
        await editMenu(menuToEdit._id, { name, description, price, categoria, imagen });
        onMenuUpdated();
      } else {
        await addMenu({ name, description, price, categoria, imagen });
      }
      console.log('Menú guardado exitosamente');
    } catch (err) {
      setError('Error al guardar el menú');
    }
  };

  return (
    <div className="min-h-screen flex items-top justify-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-white text-center fuente1">{menuToEdit ? 'Editar Menú' : 'Agregar Menú'}</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-white text-lg font-semibold">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white text-lg font-semibold">Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white text-lg font-semibold">Precio:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white text-lg font-semibold">Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-lg font-semibold">Imagen (URL):</label>
            <input
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="text-white text-xl bg-green-500 px-3 py-2 rounded hover:bg-green-600 mx-auto block fuente1"
          >
            {menuToEdit ? 'Guardar Cambios' : 'Agregar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
