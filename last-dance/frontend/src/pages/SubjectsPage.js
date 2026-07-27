import { useEffect, useState } from 'react';
import { subjectApi } from '../api/subjectApi';
import Modal from '../components/Modal';

const emptyForm = { name: '', color: '#3498db', icon: 'book' };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.name} ${subject.icon}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              Quản lý Deadline
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-800">
              Danh sách môn học
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý môn học dùng để phân loại các công việc và deadline.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-[240px]">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Tìm kiếm
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nhập tên hoặc biểu tượng..."
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <button
              type="button"
              onClick={loadSubjects}
              disabled={loading}
              className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              ↻ Tải lại
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="h-10 rounded-md bg-[#253b78] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3268]"
            >
              + Thêm môn học
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Tổng số:{' '}
            <strong className="font-semibold text-slate-800">
              {subjects.length} môn học
            </strong>
          </span>
          {searchTerm && (
            <span className="text-slate-500">
              Tìm thấy {filteredSubjects.length} kết quả
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[#eef4f8] text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="w-16 border-b border-slate-200 px-4 py-3 text-center">STT</th>
                <th className="w-28 border-b border-slate-200 px-4 py-3">Mã môn</th>
                <th className="min-w-[250px] border-b border-slate-200 px-4 py-3">Tên môn học</th>
                <th className="w-36 border-b border-slate-200 px-4 py-3">Màu</th>
                <th className="w-36 border-b border-slate-200 px-4 py-3">Biểu tượng</th>
                <th className="w-40 border-b border-slate-200 px-4 py-3">Cập nhật</th>
                <th className="w-36 border-b border-slate-200 px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    Đang tải danh sách môn học...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    {subjects.length === 0
                      ? 'Chưa có môn học nào. Hãy thêm môn học đầu tiên.'
                      : 'Không tìm thấy môn học phù hợp.'}
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <tr key={subject.id} className="transition hover:bg-blue-50/40">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-600">
                      MH{String(subject.id).padStart(3, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-1 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-semibold text-slate-800">{subject.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-sm border border-black/10 align-middle"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.color}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{subject.icon}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {subject.updated_at
                        ? new Date(subject.updated_at).toLocaleDateString('vi-VN')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(subject)}
                          className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subject)}
                          className="rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
