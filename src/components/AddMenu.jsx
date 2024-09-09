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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000); // Oculta el modal de éxito después de 2 segundos
    } catch (err) {
      console.error('Error al guardar el menú:', err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000); // Oculta el modal de error después de 2 segundos
    }
  };

  return (
    <div className="flex items-start justify-center">
      <div className="p-4 pt-2 rounded-lg shadow-md w-full max-w-md bg-black">
        <h2 className="text-4xl font-bold mb-2 text-white text-center fuente1">
          {menuToEdit ? 'Editar Menú' : 'Agregar Menú'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-white text-lg font-semibold">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-white text-lg font-semibold">Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-white text-lg font-semibold">Precio:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded-lg mt-1 text-white focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="mb-2">
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

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-green-500 mb-4">¡Menú guardado exitosamente!</h3>
            <p className="text-gray-700">El menú ha sido guardado correctamente.</p>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">¡Error al guardar el menú!</h3>
            <p className="text-gray-700">Por favor, intenta nuevamente.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMenu;