// src/components/AddMenu.jsx
import React, { useState } from 'react';
import { useMenuApi } from '../api/menuApi';

const AddMenu = () => {
  const { addMenu } = useMenuApi();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenu({ name, description, price, categoria, imagen });
      console.log('Menú agregado exitosamente');
    } catch (err) {
      setError('Error al agregar el menú');
    }
  };

  return (
    <div>
      <h2>Agregar Menú</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>
        <div>
          <label>Imagen (URL):</label>
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        <button type="submit">Agregar Menú</button>
      </form>
    </div>
  );
};

export default AddMenu;
