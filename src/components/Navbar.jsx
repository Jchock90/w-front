// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg fuente1">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl md:text-3xl lg:text-4xl font-bold fuente1">
          w4it3rdestroy3r
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        <ul className={`md:flex md:space-x-4 items-center text-center ${mobileMenuOpen ? 'block' : 'hidden'} ${isAuthenticated ? 'mt-4 md:mt-0' : ''}`}>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/add-menu" className="text-white hover:text-gray-400">
                  Añadir Menú
                </Link>
              </li>
              <li>
                <Link to="/menus" className="text-white text-center hover:text-gray-400">
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
