// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AddMenu from './components/AddMenu';
import MenuList from './components/MenuList';
import ConsumerMenuList from './components/ConsumerMenuList';
import ConsumerMenuList1 from './components/ConsumerMenuList1';
import ConsumerMenuList2 from './components/ConsumerMenuList2';
import ConsumerMenuList3 from './components/ConsumerMenuList3';
import ConsumerMenuList4 from './components/ConsumerMenuList4';
import ConsumerMenuList5 from './components/ConsumerMenuList5';
import ConsumerMenuList6 from './components/ConsumerMenuList6';
import ConsumerMenuList7 from './components/ConsumerMenuList7';
import ConsumerMenuList8 from './components/ConsumerMenuList8';
import OrderList from './components/OrderList';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import './App.css';

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
}

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/consumers');

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-menu" element={<PrivateRoute element={<AddMenu />} />} />
        <Route path="/orders" element={<PrivateRoute element={<OrderList />} />} />
        <Route path="/menus" element={<PrivateRoute element={<MenuList />} />} />
        <Route path="/consumers" element={<ConsumerMenuList />} />
        <Route path="/consumers1" element={<ConsumerMenuList1 />} />
        <Route path="/consumers2" element={<ConsumerMenuList2 />} />
        <Route path="/consumers3" element={<ConsumerMenuList3 />} />
        <Route path="/consumers4" element={<ConsumerMenuList4 />} />
        <Route path="/consumers5" element={<ConsumerMenuList5 />} />
        <Route path="/consumers6" element={<ConsumerMenuList6 />} />
        <Route path="/consumers7" element={<ConsumerMenuList7 />} />
        <Route path="/consumers8" element={<ConsumerMenuList8 />} />
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
