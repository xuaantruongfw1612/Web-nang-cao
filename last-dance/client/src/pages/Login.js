import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import api from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      navigate('/subjects', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Đăng nhập thất bại',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }} className="mt-5">
      <h2 className="mb-4">Đăng nhập</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={submitting}
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </Form>
      <p className="mt-3">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </Container>
  );
}

export default Login;
