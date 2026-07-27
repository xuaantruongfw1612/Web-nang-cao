import { useEffect, useState } from 'react';
import { subjectApi } from '../api/subjectApi';
import Modal from '../components/Modal';

const emptyForm = { name: '', color: '#3498db', icon: 'book' };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // subject đang sửa, null = đang tạo mới
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    setError('');
    try {
      const data = await subjectApi.getAll();
      setSubjects(data);
    } catch {
      setError('Không tải được danh sách môn học');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(subject) {
    setEditing(subject);
    setForm({ name: subject.name, color: subject.color, icon: subject.icon });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (editing) {
        await subjectApi.update(editing.id, form);
      } else {
        await subjectApi.create(form);
      }
      setShowModal(false);
      await loadSubjects();
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(subject) {
    if (!window.confirm(`Xoá môn học "${subject.name}"?`)) return;
    try {
      await subjectApi.remove(subject.id);
      setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
    } catch {
      alert('Không xoá được môn học này');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Môn học</h1>
        <button
          onClick={openCreate}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
        >
          + Thêm môn học
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Đang tải...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có môn học nào. Bấm "Thêm môn học" để bắt đầu.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-400">{s.icon}</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline font-medium">
                Sửa
              </button>
              <button onClick={() => handleDelete(s)} className="text-red-500 hover:underline font-medium">
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Sửa môn học' : 'Thêm môn học'} onClose={() => setShowModal(false)}>
          {formError && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Tên môn học
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Phát triển Web nâng cao"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Màu
                </label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full h-9 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="book"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
