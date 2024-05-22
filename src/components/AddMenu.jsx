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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">{menuToEdit ? 'Editar Menú' : 'Agregar Menú'}</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Imagen (URL):</label>
            <input
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {menuToEdit ? 'Guardar Cambios' : 'Agregar Menú'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
