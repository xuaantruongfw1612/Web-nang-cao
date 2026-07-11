import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import api from '../api/axios';

function Register() {
  const [form, setForm] = useState({ student_code: '', full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/users/register', form);
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
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
          <Form.Control name="student_code" value={form.student_code} onChange={onChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Họ tên</Form.Label>
          <Form.Control name="full_name" value={form.full_name} onChange={onChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={onChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={onChange} required />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">Đăng ký</Button>
      </Form>
      <p className="mt-3">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </Container>
  );
}

export default Register;