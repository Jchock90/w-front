// src/components/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password
      });
      console.log(response.data);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 2000); // Oculta el modal y redirige después de 2 segundos
    } catch (err) {
      console.error('Error registrando usuario:', err);
      setError(err.response?.data?.message || 'Error desconocido');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000); // Oculta el modal después de 2 segundos
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-black fuente1 pt-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-900">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-black-500"
          >
            Registrarse
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-green-500 mb-4">¡Usuario creado exitosamente!</h3>
            <p className="text-gray-700">Redirigiendo al inicio de sesión...</p>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">¡Error al crear el usuario!</h3>
            <p className="text-gray-700">Por favor, verifica los datos e intenta nuevamente.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
