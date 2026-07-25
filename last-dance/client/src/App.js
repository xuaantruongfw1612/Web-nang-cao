import React from 'react';
import {
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import api from './api/axios';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import TaskManager from './pages/TaskManager';

function App() {
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith('/tasks') ||
    location.pathname.startsWith('/subjects');

  const handleLogout = async () => {
    try {
      if (isLoggedIn) {
        await api.post('/api/auth/logout');
      }
    } catch {
      // Luôn xóa token phía client kể cả khi token đã hết hạn.
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  };

  return (
    <>
      {!isDashboardRoute && (
        <Navbar bg="light" expand="lg" className="px-3">
          <Navbar.Brand as={RouterLink} to="/">
            STUDENT DEADLINE MANAGER
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={RouterLink} to="/tasks">
                Quản lý Deadline
              </Nav.Link>
              <Nav.Link as={RouterLink} to="/subjects">
                Môn học
              </Nav.Link>
              <NavDropdown title="Tài khoản" id="account-dropdown">
                {isLoggedIn ? (
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item as={RouterLink} to="/login">
                      Đăng nhập
                    </NavDropdown.Item>
                    <NavDropdown.Item as={RouterLink} to="/register">
                      Đăng ký
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/subjects"
          element={
            <MainLayout>
              <Subjects />
            </MainLayout>
          }
        />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </>
  );
}

export default App;
