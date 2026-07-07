import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container, Carousel, Table } from 'react-bootstrap';

function App() {
  // Khai báo các trạng thái để lưu dữ liệu từ API NestJS
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API /users/profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Lấy JWT Token giả định đã lưu ở localStorage sau khi đăng nhập thành công
        const token = localStorage.getItem('token');

        // const response = await fetch('http://localhost:3001/users/profile', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // Gửi Token lên để vượt qua @UseGuards(AuthGuard('jwt'))
        //     'Authorization': `Bearer ${token}` 
        //   }
        // });

const response = await fetch('https://bookish-fishstick-4jwgx96rp94vhgr9-3001.app.github.dev/users/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  }
});

        if (response.ok) {
          const data = await response.json();
          // data.userLogedIn tương ứng với cấu trúc trả về từ NestJS Controller của bạn
          setProfile(data.userLogedIn); 
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="App">
      
      {/* 1. THANH NAVBAR */}
      <Navbar bg="light" expand="lg" className="px-3">
        <Container fluid> 
          <Navbar.Brand href="#home" className="fw-bold text-uppercase" style={{ fontSize: '1.5rem' }}>
            MY APP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ fontSize: '1.1rem' }}>
              <Nav.Link href="#home" className="px-3">Home</Nav.Link>
              <Nav.Link href="#link" className="px-3">Link</Nav.Link>
              <NavDropdown title="Options" id="basic-nav-dropdown" className="px-3">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.3">Something else</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            
            {/* Hiển thị tên người dùng trên thanh điều hướng nếu đã đăng nhập */}
            {profile && (
              <span className="navbar-text fw-bold text-primary pe-3">
                Xin chào, {profile.username || profile.name || 'User'}
              </span>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. SLIDE BANNER */}
      <Carousel controls={true} indicators={true}>
        
        {/* Slide 1 */}
        <Carousel.Item style={{ height: '720px' }}>
          <img src="/images/kitten.jpg" alt="Mèo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Carousel.Caption className="d-flex flex-column h-100 justify-content-center pb-5">
            <h2 className="fw-semibold">Good Afternoon</h2>
            <p className="fs-5 text-light opacity-75">Spaces and Cybers.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item style={{ height: '720px' }}>
          <img src="/images/tungtung.jpg" alt="Tungtung" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Carousel.Caption className="d-flex flex-column h-100 justify-content-center pb-5">
            <h2 className="fw-semibold">Welcome Back</h2>
            <p className="fs-5 text-light opacity-75">Explore the new world.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item style={{ height: '720px' }}>
          <img src="/images/Cat_August_2010-4.jpg" alt="cat2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Carousel.Caption className="d-flex flex-column h-100 justify-content-center pb-5">
            <h2 className="fw-semibold">Hello Kitty</h2>
            <p className="fs-5 text-light opacity-75">Lovely moments.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 4 */}
        <Carousel.Item style={{ height: '720px' }}>
          <img src="/images/Cat-on-couch.jpg" alt="cat3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Carousel.Caption className="d-flex flex-column h-100 justify-content-center pb-5">
            <h2 className="fw-semibold">Relaxing Time</h2>
            <p className="fs-5 text-light opacity-75">Cozy and warm.</p>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>

      {/* 3. BẢNG DỮ LIỆU */}
      <Table bordered hover responsive className="mb-0 text-start align-middle mt-2">
        <thead className="table-light">
          <tr>
            <th className="fw-bold py-3" style={{ width: '48%', fontSize: '1.1rem' }}>Name</th>
            <th className="fw-bold py-3" style={{ width: '15%', fontSize: '1.1rem' }}>ID</th>
            <th className="fw-bold py-3" style={{ fontSize: '1.1rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center py-3 text-muted">Đang tải dữ liệu từ server...</td>
            </tr>
          ) : profile ? (
            // Hiển thị dữ liệu động lấy từ req.user của NestJS
            <tr className="table-secondary">
              <td className="py-3" style={{ fontSize: '1.1rem' }}>{profile.username || profile.name || 'John Doe'}</td>
              <td className="py-3" style={{ fontSize: '1.1rem' }}>{profile.id || '1'}</td>
              <td className="py-3" style={{ fontSize: '1.1rem' }}><span className="badge bg-success">Active</span></td>
            </tr>
          ) : (
            // Phương án dự phòng (Fallback) nếu chưa login hoặc không có token hợp lệ
            <tr className="table-secondary">
              <td className="py-3" style={{ fontSize: '1.1rem' }}>John Doe (Mẫu)</td>
              <td className="py-3" style={{ fontSize: '1.1rem' }}>1</td>
              <td className="py-3" style={{ fontSize: '1.1rem' }}>Chưa đăng nhập (JWT)</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 4. FOOTER */}
      <footer className="text-center py-4 text-dark" style={{ fontSize: '1.1rem' }}>
        <span role="img" aria-label="pin">📍</span>Hanoi, August 2026
      </footer>

    </div>
  );
}

export default App;