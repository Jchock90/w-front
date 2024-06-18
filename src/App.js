// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AddMenu from './components/AddMenu';
import MenuList from './components/MenuList';
import ConsumersMenuList from './components/ConsumerMenuList';

import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import './App.css';

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
}

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/consumers';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-menu" element={<PrivateRoute element={<AddMenu />} />} />
        <Route path="/menus" element={<PrivateRoute element={<MenuList />} />} />
        <Route path="/consumers" element={<ConsumersMenuList />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
