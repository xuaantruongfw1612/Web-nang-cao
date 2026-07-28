import { useEffect, useMemo, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { subjectApi } from '../api/subjectApi';
import Modal from './Modal';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { extractErrorMessage } from '../utils/errors';

const STATUS_BADGE = { PENDING: 'yellow', IN_PROGRESS: 'blue', COMPLETED: 'green', OVERDUE: 'red', CANCELLED: 'gray' };
const STATUS_LABEL = {
  PENDING: 'Chưa làm',
  IN_PROGRESS: 'Đang làm',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã huỷ',
};
const TYPE_BADGE = { ASSIGNMENT: 'purple', STUDY: 'blue', EXAM: 'red' };
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
  const [sortOrder, setSortOrder] = useState('ASC');

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
    
    // Tách riêng việc tải môn học và công việc để tránh lỗi chéo
    try {
      const subjectList = await subjectApi.getAll();
      setSubjects(subjectList);
    } catch (err) {
      console.error('Lỗi khi tải môn học:', err);
    }

    try {
      const taskList = await taskApi.getAll();
      setTasks(taskList);
    } catch (err) {
      console.error('Lỗi khi tải công việc:', err);
      setError('Không tải được danh sách công việc');
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSortedTasks = useMemo(() => {
    const result = typeFilter === 'ALL' ? [...tasks] : tasks.filter((t) => t.type === typeFilter);
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

    const isLocationRequired = form.type === 'EXAM' || form.type === 'STUDY';

    if (isLocationRequired && !form.room.trim()) {
      setFormError('Vui lòng nhập Phòng / Địa điểm cho Lịch thi hoặc Lịch học.');
      setSubmitting(false);
      return;
    }

    const formTime = new Date(form.taskDatetime).getTime();
    const isDuplicateTime = tasks.some((t) => {
      if (editing && t.id === editing.id) return false;
      return new Date(t.taskDatetime).getTime() === formTime;
    });

    if (isDuplicateTime) {
      const confirmMsg = 'Cảnh báo trùng lịch: Bạn đã có công việc/lịch khác vào đúng thời gian này. Tiếp tục thêm?';
      if (!window.confirm(confirmMsg)) {
        setSubmitting(false);
        return;
      }
    }

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
      setFormError(extractErrorMessage(err));
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

  const isLocationRequired = form.type === 'EXAM' || form.type === 'STUDY';
  const hasLocationError = formError.includes('Phòng / Địa điểm');

  return (
    <div>
      <PageHeader title="Deadline" subtitle="Danh sách công việc và hạn chót của bạn" />

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Lọc theo loại
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-[160px] focus:outline-none focus:border-pink-500 text-gray-700"
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
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-[160px] focus:outline-none focus:border-pink-500 text-gray-700"
              >
                <option value="ASC">Gần nhất</option>
                <option value="DESC">Xa nhất</option>
              </select>
            </div>
          </div>

          <Button onClick={openCreate} className="bg-pink-500 hover:bg-pink-600 text-white">
            + Thêm Deadline mới
          </Button>
        </div>

        {loading && <p className="text-sm text-gray-400">Đang tải...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && filteredAndSortedTasks.length === 0 && (
          <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">
              Chưa có công việc nào. Bấm "Thêm Deadline mới" để bắt đầu.
            </p>
          </div>
        )}

        {!loading && filteredAndSortedTasks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-100 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-center w-16">STT</th>
                  <th className="px-4 py-3">Tên công việc</th>
                  <th className="px-4 py-3 text-center">Loại</th>
                  <th className="px-4 py-3 text-center">Thời gian</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedTasks.map((item, index) => {
                  const overdue = isOverdue(item);
                  const displayStatus = overdue ? 'OVERDUE' : item.status;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        {item.subject?.name && (
                          <p className="text-xs text-gray-400 mt-0.5">{item.subject.name}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge color={TYPE_BADGE[item.type] || 'gray'}>{item.type || '—'}</Badge>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {new Date(item.taskDatetime).toLocaleString('vi-VN')}
                        {overdue && (
                          <span className="block text-[11px] font-bold text-red-500 mt-0.5">QUÁ HẠN</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge color={STATUS_BADGE[displayStatus] || 'gray'}>
                          {STATUS_LABEL[displayStatus] || displayStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-sm">
                          {!overdue && item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleMarkDone(item)}
                              className="text-green-600 hover:underline font-semibold"
                            >
                              Xong
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(item)}
                            className="text-orange-600 hover:underline font-semibold"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-500 hover:underline font-semibold"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showModal && (
        <Modal title={editing ? 'Sửa công việc' : 'Thêm Deadline mới'} onClose={() => setShowModal(false)}>
          {formError && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Tên công việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                placeholder="Ví dụ: Hoàn thiện file báo cáo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Loại <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {TASK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0 col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {form.type === 'ASSIGNMENT' ? 'Hạn chót' : 'Thời gian bắt đầu'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.taskDatetime}
                  onChange={(e) => setForm({ ...form, taskDatetime: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                Phòng / Địa điểm {isLocationRequired && <span className="text-red-500 text-sm">*</span>}
              </label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
                  hasLocationError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-pink-500 focus:ring-pink-500'
                }`}
                placeholder={isLocationRequired ? 'Vd: P.302 - A1 (* Bắt buộc)' : 'Vd: P.302 - A1 (không bắt buộc)'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Ghi chú <span className="text-gray-400 text-[10px] lowercase font-normal">(không bắt buộc)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-pink-500 hover:bg-pink-600 text-white border-transparent">
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}