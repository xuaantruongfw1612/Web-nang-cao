import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import api from '../api/axios';

const emptyForm = { name: '', color: '#3498db', icon: 'book' };

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadSubjects = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) return navigate('/login');
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (subject) => {
    setSelected(subject);
    setForm({ name: subject.name, color: subject.color, icon: subject.icon });
    setShowForm(true);
  };

  const viewDetails = async (id) => {
    setError('');
    try {
      const response = await api.get(`/subjects/${id}`);
      setSelected(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết môn học');
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (selected) await api.patch(`/subjects/${selected.id}`, form);
      else await api.post('/subjects', form);
      setShowForm(false);
      setSelected(null);
      await loadSubjects();
    } catch (err) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Không thể lưu môn học');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (subject) => {
    if (!window.confirm(`Xóa môn học “${subject.name}”?`)) return;
    try {
      await api.delete(`/subjects/${subject.id}`);
      setSelected(null);
      setSubjects((current) => current.filter((item) => item.id !== subject.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa môn học');
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h2 mb-1">Môn học</h1><p className="text-muted mb-0">Quản lý các môn học của bạn.</p></div>
        <Button onClick={openCreate}>Thêm môn học</Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {!loading && subjects.length === 0 && <Alert variant="info">Bạn chưa có môn học nào.</Alert>}
      <Row className="g-3">
        {subjects.map((subject) => (
          <Col md={6} lg={4} key={subject.id}>
            <Card className="h-100" style={{ borderTop: `5px solid ${subject.color}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between"><Card.Title>{subject.name}</Card.Title><Badge bg="light" text="dark">{subject.icon}</Badge></div>
                <div className="d-flex gap-2 mt-4">
                  <Button size="sm" onClick={() => viewDetails(subject.id)}>Chi tiết</Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => openEdit(subject)}>Sửa</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => remove(subject)}>Xóa</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Form onSubmit={save}>
          <Modal.Header closeButton><Modal.Title>{selected ? 'Chỉnh sửa môn học' : 'Thêm môn học'}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Tên môn học</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required autoFocus /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Màu</Form.Label><Form.Control type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>Biểu tượng</Form.Label><Form.Control value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} maxLength={50} required /><Form.Text>Ví dụ: book, calculator, code.</Form.Text></Form.Group>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowForm(false)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu'}</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={Boolean(selected) && !showForm} onHide={() => setSelected(null)} centered>
        {selected && <><Modal.Header closeButton><Modal.Title>{selected.name}</Modal.Title></Modal.Header><Modal.Body><p><strong>Màu:</strong> <span style={{ color: selected.color }}>●</span> {selected.color}</p><p><strong>Biểu tượng:</strong> {selected.icon}</p><p className="mb-0"><strong>Ngày tạo:</strong> {new Date(selected.created_at).toLocaleString('vi-VN')}</p></Modal.Body><Modal.Footer><Button variant="outline-danger" onClick={() => remove(selected)}>Xóa</Button><Button onClick={() => openEdit(selected)}>Chỉnh sửa</Button></Modal.Footer></>}
      </Modal>
    </Container>
  );
}

export default Subjects;
