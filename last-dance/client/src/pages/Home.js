import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import api from '../api/axios';

function Home() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return;
    api
      .get('/users/profile')
      .then((res) => setProfile(res.data.userLogedIn))
      .catch(() => setError('Không lấy được thông tin người dùng. Vui lòng đăng nhập lại.'));
  }, []);

  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <div style={{
            height: '400px',
            background: 'linear-gradient(135deg, #7fd4c1, #4ea1a1)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <h1>Good Morning</h1>
            <p>Cybers and Spaces.</p>
          </div>
        </Carousel.Item>
      </Carousel>

      {error && <Alert variant="warning" className="m-3">{error}</Alert>}

      {profile ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr><th>Name</th><th>ID</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{profile.fullName || profile.email}</td>
              <td>{profile.userId}</td>
              <td>Active</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        !error && <Alert variant="info" className="m-3">Vui lòng đăng nhập để xem thông tin.</Alert>
      )}
    </div>
  );
}

export default Home;