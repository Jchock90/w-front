// src/components/AuthForm.jsx

import React, { useState } from 'react';
import { register, login } from '../api/authApi';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, password };

    try {
      if (isLogin) {
        const response = await login(userData);
        console.log('Login exitoso:', response);
      } else {
        const response = await register(userData);
        console.log('Registro exitoso:', response);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

export default AuthForm;