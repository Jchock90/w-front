// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddMenu from './components/AddMenu';
import MenuList from './components/MenuList';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <nav>
          <ul>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
            <li><Link to="/add-menu">Añadir Menú</Link></li>
            <li><Link to="/menus">Lista de Menús</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-menu" element={<PrivateRoute element={<AddMenu />} />} />
          <Route path="/menus" element={<PrivateRoute element={<MenuList />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
