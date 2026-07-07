import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Đã thêm NavDropdown vào đây
import { Navbar, Nav, NavDropdown, Container, Carousel, Table } from 'react-bootstrap';

function App() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const [tasks] = useState([
    { id: '08ef2c...', title: 'Bài tập lớn Mạng máy tính', type: 'ASSIGNMENT', taskDatetime: '2026-06-22 09:00:00', room: 'N/A', status: 'PENDING' },
    { id: '19fa3d...', title: 'Chuẩn bị slide Kỹ năng thuyết trình', type: 'STUDY', taskDatetime: '2026-06-17 07:30:00', room: 'Phòng Hội Thảo', status: 'PENDING' },
    { id: 'a1ab2c...', title: 'Họp nhóm CLB Tình nguyện', type: 'MEETING', taskDatetime: '2026-06-16 18:00:00', room: 'Căng tin trường', status: 'PENDING' },
    { id: 'b3fa7d...', title: 'Kiểm tra giữa kỳ Toán A1', type: 'EXAM', taskDatetime: '2026-06-20 08:00:00', room: 'Phòng 402-A2', status: 'PENDING' },
    { id: 'c4ab8e...', title: 'Bài tập về nhà: Con trỏ và Đệ quy', type: 'ASSIGNMENT', taskDatetime: '2026-06-18 23:59:59', room: 'N/A', status: 'PENDING' },
    { id: 'd5bc9f...', title: 'Học từ vựng Unit 5', type: 'STUDY', taskDatetime: '2026-06-15 14:30:00', room: 'Thư viện', status: 'COMPLETED' },
    { id: 'e6cd0a...', title: 'Thực hành Viết câu lệnh SQL Join', type: 'ASSIGNMENT', taskDatetime: '2026-06-19 12:00:00', room: 'Phòng Lab 3', status: 'PENDING' },
    { id: 'f7de1b...', title: 'Thi cuối kỳ Cấu trúc dữ liệu', type: 'EXAM', taskDatetime: '2026-06-25 13:30:00', room: 'Hội trường G3', status: 'PENDING' },
  ]);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg" className="border-bottom px-4">
        <Container fluid>
          <Navbar.Brand href="#home" className="fw-bold">MY APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              {/* Đã thêm lại menu Options */}
              <NavDropdown title="Options" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action 1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Action 2</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="p-0">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img className="d-block w-100" style={{ height: '350px', objectFit: 'cover' }} src="https://object.pixocial.com/pixocial/bqnqy3h6i7rlj0j70lqq71dt.jpg" alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{ height: '350px', objectFit: 'cover' }} src="https://media.istockphoto.com/id/1060834578/vi/anh/m%C3%A0u-n%C6%B0%E1%BB%9Bc-m%C3%A0u-ng%E1%BB%8Dc-lam-n%E1%BB%81n-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng.jpg?s=612x612&w=0&k=20&c=WL9ONbTvEYKzCYknpU7QVU9M0VHkh5j67qMgGIb6JNY=" alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{ height: '350px', objectFit: 'cover' }} src="https://png.pngtree.com/thumb_back/fh260/background/20241015/pngtree-abstract-watercolor-background-with-pastel-colors-like-light-blue-and-pink-image_16394760.jpg" alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      </Container>

      <Container fluid className="px-3 mt-3">
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Type</th><th>Date & Time</th><th>Room</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.type}</td>
                <td>{task.taskDatetime}</td>
                <td>{task.room}</td>
                <td>
                  <span className={`badge ${task.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="d-flex justify-content-center align-items-center mt-4 mb-4 gap-1">
        <i className="bi bi-award text-dark fs-5"></i> Hanoi, August 2026
      </footer>
    </div>
  );
}

export default App;