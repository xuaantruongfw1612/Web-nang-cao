import React from 'react';
import { Routes, Route, Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskManager from './pages/TaskManager';

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const location = useLocation(); // Lấy đường dẫn hiện tại để kiểm tra

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  // Kiểm tra xem có đang ở các trang quản lý (Dashboard) không
  const isDashboardRoute = location.pathname.startsWith('/tasks');

  return (
    <>
      {/* Chỉ hiển thị Navbar Bootstrap cũ khi KHÔNG phải là trang Dashboard */}
      {!isDashboardRoute && (
        <Navbar bg="light" expand="lg" className="px-3">
          <Navbar.Brand as={RouterLink} to="/">MY APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={RouterLink} to="/">Home</Nav.Link>
              <Nav.Link as={RouterLink} to="/link">Link</Nav.Link>
              <NavDropdown title="Options" id="options-dropdown">
                {isLoggedIn ? (
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item as={RouterLink} to="/login">Login</NavDropdown.Item>
                    <NavDropdown.Item as={RouterLink} to="/register">Register</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}

      <Routes>
        {/* Tự động chuyển hướng từ trang gốc (/) thẳng sang /tasks */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Trang TaskManager đã tự động gọi MainLayout bên trong nó */}
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </>
  );
}

export default App;