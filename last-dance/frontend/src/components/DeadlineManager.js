import { useEffect, useMemo, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { subjectApi } from '../api/subjectApi';
import Modal from './Modal';

const STATUS_STYLE = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const STATUS_LABEL = {
  PENDING: 'Chưa làm',
  IN_PROGRESS: 'Đang làm',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã huỷ',
};

const TYPE_STYLE = {
  ASSIGNMENT: 'bg-purple-100 text-purple-700',
  STUDY: 'bg-blue-100 text-blue-700',
  EXAM: 'bg-red-100 text-red-700',
};

const TASK_TYPES = ['ASSIGNMENT', 'STUDY', 'EXAM'];

const emptyForm = {
  title: '',
  type: 'ASSIGNMENT',
  taskDatetime: '',
  room: '',
  notes: '',
  subjectId: '',
};

function isOverdue(task) {
  if (task.status === 'COMPLETED' || task.status === 'CANCELLED') return false;
  return new Date(task.taskDatetime).getTime() < Date.now();
}

export default function DeadlineManager() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('ASC'); // 'ASC': Gần nhất, 'DESC': Xa nhất

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [taskList, subjectList] = await Promise.all([taskApi.getAll(), subjectApi.getAll()]);
      setTasks(taskList);
      setSubjects(subjectList);
    } catch {
      setError('Không tải được danh sách công việc');
    } finally {
      setLoading(false);
    }
  }

  // Xử lý Lọc và Sắp xếp đồng thời
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Lọc theo loại
    let result = typeFilter === 'ALL' ? [...tasks] : tasks.filter((t) => t.type === typeFilter);

    // 2. Sắp xếp theo hạn chót
    result.sort((a, b) => {
      const timeA = new Date(a.taskDatetime).getTime();
      const timeB = new Date(b.taskDatetime).getTime();
      return sortOrder === 'ASC' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [tasks, typeFilter, sortOrder]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({
      title: task.title,
      type: task.type || 'ASSIGNMENT',
      taskDatetime: task.taskDatetime ? task.taskDatetime.slice(0, 16) : '',
      room: task.room || '',
      notes: task.notes || '',
      subjectId: task.subjectId || task.subject?.id || '',
    });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        taskDatetime: new Date(form.taskDatetime).toISOString(),
        subjectId: form.subjectId ? Number(form.subjectId) : undefined,
      };
      if (editing) {
        await taskApi.update(editing.id, payload);
      } else {
        await taskApi.create(payload);
      }
      setShowModal(false);
      await loadAll();
    } catch (err) {
      const responseData = err.response?.data;
      let safeErrorMessage = 'Có lỗi xảy ra, vui lòng thử lại';

      if (responseData) {
        if (typeof responseData.message === 'string') {
          safeErrorMessage = responseData.message;
        } else if (Array.isArray(responseData.message)) {
          safeErrorMessage = responseData.message.join(', ');
        } else if (typeof responseData === 'string') {
          safeErrorMessage = responseData;
        }
      } else if (err.message) {
        safeErrorMessage = err.message;
      }

      setFormError(safeErrorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Xoá công việc "${task.title}"?`)) return;
    try {
      await taskApi.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch {
      alert('Không xoá được công việc này');
    }
  }

  async function handleMarkDone(task) {
    try {
      const updated = await taskApi.update(task.id, { status: 'COMPLETED' });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      alert('Không cập nhật được trạng thái');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* BỘ LỌC, SẮP XẾP VÀ NÚT THÊM */}
      <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Lọc theo loại
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-[160px] focus:outline-none focus:border-blue-500 text-gray-700"
            >
              <option value="ALL">Tất cả</option>
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Sắp xếp hạn chót
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-[160px] focus:outline-none focus:border-blue-500 text-gray-700"
            >
              <option value="ASC">Gần nhất</option>
              <option value="DESC">Xa nhất</option>
            </select>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
        >
          + Thêm Deadline mới
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Đang tải...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {/* HIỂN THỊ LỖI KHI TRỐNG THÔNG MINH */}
      {!loading && !error && filteredAndSortedTasks.length === 0 && (
        <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-sm text-gray-500">
            {typeFilter === 'ALL' 
              ? 'Chưa có công việc nào. Bấm "Thêm Deadline mới" để bắt đầu.'
              : `Chưa có công việc ${typeFilter} nào, hãy thêm deadline mới.`}
          </p>
        </div>
      )}

      {/* BẢNG DANH SÁCH (TABLE) */}
      {!loading && filteredAndSortedTasks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-center w-16">STT</th>
                <th className="px-4 py-3">Tên công việc</th>
                <th className="px-4 py-3 text-center">Loại</th>
                <th className="px-4 py-3 text-center">Hạn chót</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedTasks.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-center text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    {item.subject?.name && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.subject.name}</p>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase ${TYPE_STYLE[item.type] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {item.type || '—'}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center text-gray-600">
                    {new Date(item.taskDatetime).toLocaleString('vi-VN')}
                    {isOverdue(item) && (
                      <span className="block text-[11px] font-bold text-red-500 mt-0.5">QUÁ HẠN</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${STATUS_STYLE[item.status] || 'bg-gray-100 text-gray-500'}`}
                    >
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm">
                      {item.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleMarkDone(item)}
                          className="text-green-600 hover:underline font-medium"
                        >
                          Hoàn thành
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-500 hover:underline font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Sửa công việc' : 'Thêm Deadline mới'} onClose={() => setShowModal(false)}>
          {formError && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Tên công việc
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Hoàn thiện file báo cáo"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Loại
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="ASSIGNMENT">ASSIGNMENT</option>
                  <option value="STUDY">STUDY</option>
                  <option value="EXAM">EXAM</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Môn học
                </label>
                <select
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">— Không chọn —</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Hạn chót
              </label>
              <input
                type="datetime-local"
                required
                value={form.taskDatetime}
                onChange={(e) => setForm({ ...form, taskDatetime: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Phòng / Địa điểm
              </label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="P.302 - A1 (không bắt buộc)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Ghi chú
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
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