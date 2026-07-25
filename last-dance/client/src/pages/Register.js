import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import api from '../api/axios';

const initialForm = {
  studentCode: '',
  fullName: '',
  email: '',
  password: '',
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/api/auth/register', form);
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Đăng ký thất bại',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }} className="mt-5">
      <h2 className="mb-4">Đăng ký</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Mã số sinh viên</Form.Label>
          <Form.Control
            name="studentCode"
            value={form.studentCode}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Họ tên</Form.Label>
          <Form.Control
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={submitting}
        >
          {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </Form>
      <p className="mt-3">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </Container>
  );
}

export default Register;
