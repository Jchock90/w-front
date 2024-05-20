import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          w4it3rd3stroy3r
        </Link>
        <ul className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/add-menu" className="text-white">
                  Añadir Menú
                </Link>
              </li>
              <li>
                <Link to="/menus" className="text-white">
                  Lista de Menús
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-white bg-red-500 px-3 py-2 rounded"
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
