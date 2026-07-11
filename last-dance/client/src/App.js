import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <>
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;