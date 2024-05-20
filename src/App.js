import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddMenu from './components/AddMenu';
import MenuList from './components/MenuList';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import './App.css';

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
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
