import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          w4it3rdestroy3r
        </Link>
        <ul className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/add-menu" className="text-white hover:text-gray-400">
                  Añadir Menú
                </Link>
              </li>
              <li>
                <Link to="/menus" className="text-white hover:text-gray-400">
                  Lista de Menús
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-white bg-red-500 px-3 py-2 rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-400">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-400">
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
