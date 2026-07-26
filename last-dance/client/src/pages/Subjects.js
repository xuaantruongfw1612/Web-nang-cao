import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyForm = { name: '', color: '#3498db', icon: 'book' };

const iconMap = {
  book: '📚',
  calculator: '🧮',
  code: '💻',
  database: '🗄️',
  globe: '🌐',
  tree: '🌳',
  users: '👥',
};

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleApiError = useCallback(
    (err, fallbackMessage) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
        return;
      }

      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || fallbackMessage,
      );
    },
    [navigate],
  );

  const loadSubjects = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (err) {
      handleApiError(err, 'Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  }, [handleApiError, navigate]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const openCreate = () => {
    setError('');
    setSelected(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (subject) => {
    setError('');
    setSelected(subject);
    setForm({
      name: subject.name,
      color: subject.color,
      icon: subject.icon,
    });
    setShowForm(true);
  };

  const closeDialogs = () => {
    setShowForm(false);
    setSelected(null);
  };

  const viewDetails = async (id) => {
    setError('');

    try {
      const response = await api.get(`/subjects/${id}`);
      setSelected(response.data);
    } catch (err) {
      handleApiError(err, 'Không thể tải chi tiết môn học');
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (selected) {
        await api.patch(`/subjects/${selected.id}`, form);
      } else {
        await api.post('/subjects', form);
      }

      closeDialogs();
      await loadSubjects();
    } catch (err) {
      handleApiError(err, 'Không thể lưu môn học');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (subject) => {
    if (!window.confirm(`Bạn có chắc muốn xóa môn học “${subject.name}”?`)) {
      return;
    }

    setDeletingId(subject.id);
    setError('');

    try {
      await api.delete(`/subjects/${subject.id}`);
      setSubjects((current) =>
        current.filter((item) => item.id !== subject.id),
      );
      setSelected(null);
    } catch (err) {
      handleApiError(err, 'Không thể xóa môn học');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Danh mục Môn học
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý môn học và phân loại deadline của bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-[#222b45] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d3a5d]"
        >
          + Thêm môn học
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="ml-4 font-bold"
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#222b45]" />
              Đang tải danh sách môn học...
            </div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 text-5xl">📚</div>
            <h3 className="font-semibold text-gray-800">
              Chưa có môn học nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tạo môn học đầu tiên để bắt đầu phân loại deadline của bạn.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Thêm môn học
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#222b45] text-xs uppercase tracking-wide text-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left">STT</th>
                  <th className="px-5 py-3 text-left">Môn học</th>
                  <th className="px-5 py-3 text-left">Màu nhận diện</th>
                  <th className="px-5 py-3 text-left">Biểu tượng</th>
                  <th className="px-5 py-3 text-left">Ngày cập nhật</th>
                  <th className="px-5 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subjects.map((subject, index) => (
                  <tr
                    key={subject.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-1 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-semibold text-gray-800">
                          {subject.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border border-black/10 align-middle"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.color}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      <span className="mr-2 text-lg">
                        {iconMap[subject.icon] || '📘'}
                      </span>
                      {subject.icon}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {new Date(subject.updated_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => viewDetails(subject.id)}
                          className="rounded border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(subject)}
                          className="rounded border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(subject)}
                          disabled={deletingId === subject.id}
                          className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === subject.id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-form-title"
        >
          <form
            onSubmit={save}
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3
                id="subject-form-title"
                className="text-lg font-bold text-gray-800"
              >
                {selected ? 'Chỉnh sửa môn học' : 'Thêm môn học'}
              </h3>
              <button
                type="button"
                onClick={closeDialogs}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tên môn học
                </span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  maxLength={100}
                  required
                  autoFocus
                  placeholder="Ví dụ: Lập trình Web"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Màu nhận diện
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(event) =>
                      setForm({ ...form, color: event.target.value })
                    }
                    className="h-11 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1"
                  />
                  <input
                    value={form.color}
                    onChange={(event) =>
                      setForm({ ...form, color: event.target.value })
                    }
                    pattern="#[0-9a-fA-F]{6}"
                    required
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Biểu tượng
                </span>
                <select
                  value={form.icon}
                  onChange={(event) =>
                    setForm({ ...form, icon: event.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="book">📚 Sách</option>
                  <option value="calculator">🧮 Máy tính</option>
                  <option value="code">💻 Lập trình</option>
                  <option value="database">🗄️ Cơ sở dữ liệu</option>
                  <option value="globe">🌐 Mạng máy tính</option>
                  <option value="tree">🌳 Cấu trúc dữ liệu</option>
                  <option value="users">👥 Kỹ năng mềm</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={closeDialogs}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Đang lưu...' : 'Lưu môn học'}
              </button>
            </div>
          </form>
        </div>
      )}

      {selected && !showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-detail-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div
              className="h-2"
              style={{ backgroundColor: selected.color }}
            />
            <div className="flex items-start justify-between px-6 pt-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {iconMap[selected.icon] || '📘'}
                </span>
                <div>
                  <h3
                    id="subject-detail-title"
                    className="text-xl font-bold text-gray-800"
                  >
                    {selected.name}
                  </h3>
                  <p className="text-sm text-gray-500">Mã #{selected.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDialogs}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <dl className="space-y-3 px-6 py-5 text-sm">
              <div className="flex justify-between border-b pb-3">
                <dt className="text-gray-500">Màu nhận diện</dt>
                <dd className="font-medium text-gray-800">{selected.color}</dd>
              </div>
              <div className="flex justify-between border-b pb-3">
                <dt className="text-gray-500">Biểu tượng</dt>
                <dd className="font-medium text-gray-800">{selected.icon}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Ngày tạo</dt>
                <dd className="font-medium text-gray-800">
                  {new Date(selected.created_at).toLocaleString('vi-VN')}
                </dd>
              </div>
            </dl>

            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => remove(selected)}
                className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => openEdit(selected)}
                className="rounded-md bg-[#222b45] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d3a5d]"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Subjects;
