import { useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';

const STATUS_STYLE = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SENT: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const STATUS_LABEL = {
  PENDING: 'Chờ gửi',
  SENT: 'Đã gửi',
  FAILED: 'Gửi lỗi',
  CANCELLED: 'Đã huỷ',
};

export default function NotificationsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    setError('');
    try {
      const data = await notificationApi.getAll();
      setLogs(data);
    } catch {
      setError('Không tải được danh sách nhắc nhở');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(log) {
    if (!window.confirm('Huỷ nhắc nhở này?')) return;
    try {
      await notificationApi.cancel(log.id);
      await loadLogs();
    } catch {
      alert('Chỉ có thể huỷ nhắc nhở đang ở trạng thái "Chờ gửi"');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Lịch sử nhắc nhở</h1>
        <p className="text-sm text-gray-400 mt-1">
          Hệ thống tự động tạo nhắc nhở khi công việc sắp đến hạn và gửi email đúng giờ đã lên lịch.
        </p>
      </div>

      {loading && <p className="text-sm text-gray-400">Đang tải...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && logs.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có nhắc nhở nào được lên lịch.</p>
      )}

      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Nội dung</th>
                <th className="px-4 py-3 text-center">Thời điểm gửi</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-gray-700">{log.message}</td>
                  <td className="px-4 py-4 text-center text-gray-500">
                    {new Date(log.scheduledAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${STATUS_STYLE[log.status] || 'bg-gray-100 text-gray-500'}`}
                    >
                      {STATUS_LABEL[log.status] || log.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {log.status === 'PENDING' ? (
                      <button
                        onClick={() => handleCancel(log)}
                        className="text-red-500 hover:underline font-medium text-sm"
                      >
                        Huỷ
                      </button>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
