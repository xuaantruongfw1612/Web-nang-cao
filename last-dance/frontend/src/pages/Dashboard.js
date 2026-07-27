import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';

const STATUS_BADGE = { PENDING: 'yellow', IN_PROGRESS: 'blue', COMPLETED: 'green', OVERDUE: 'red', CANCELLED: 'gray' };
const STATUS_LABEL = {
  PENDING: 'Chưa làm',
  IN_PROGRESS: 'Đang làm',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã huỷ',
};

// Giống công thức Task.isOverdue() ở backend (API không serialize method của
// entity qua JSON nên tính lại phía client theo đúng logic tương tự).
function isOverdue(task) {
  if (task.status === 'COMPLETED' || task.status === 'CANCELLED') return false;
  return new Date(task.taskDatetime).getTime() < Date.now();
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const [taskList, notiList] = await Promise.all([taskApi.getAll(), notificationApi.getAll()]);
        setTasks(taskList);
        setNotifications(notiList);
      } catch {
        setError('Không tải được dữ liệu tổng quan');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const overdue = tasks.filter(isOverdue).length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const upcoming7d = tasks.filter((t) => {
      const diff = new Date(t.taskDatetime).getTime() - Date.now();
      return diff > 0 && diff <= 7 * 86400000 && t.status !== 'COMPLETED' && t.status !== 'CANCELLED';
    }).length;
    return { total: tasks.length, overdue, completed, upcoming7d };
  }, [tasks]);

  const upcomingList = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.taskDatetime) - new Date(b.taskDatetime))
        .slice(0, 5),
    [tasks],
  );

  const recentNotifications = useMemo(() => notifications.slice(0, 4), [notifications]);

  const displayName = user?.fullName?.split(' ').slice(-1)[0] || user?.email || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Xin chào, {displayName} 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>

      {loading && <p className="text-sm text-gray-400">Đang tải...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Tổng công việc" value={stats.total} icon="📋" color="pink" />
            <StatCard label="Sắp đến hạn (7 ngày)" value={stats.upcoming7d} icon="⏰" color="blue" />
            <StatCard label="Quá hạn" value={stats.overdue} icon="⚠️" color="red" />
            <StatCard label="Đã hoàn thành" value={stats.completed} icon="✅" color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Deadline sắp tới</h2>
                <Link to="/tasks" className="text-sm text-ping-600 font-medium hover:underline">
                  Xem tất cả
                </Link>
              </div>

              {upcomingList.length === 0 ? (
                <p className="text-sm text-gray-400">Không có deadline nào sắp tới. 🎉</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {upcomingList.map((t) => (
                    <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{t.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(t.taskDatetime).toLocaleString('vi-VN')}
                          {isOverdue(t) && <span className="text-red-500 font-bold ml-2">QUÁ HẠN</span>}
                        </p>
                      </div>
                      <Badge color={STATUS_BADGE[t.status] || 'gray'}>{STATUS_LABEL[t.status] || t.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Nhắc nhở gần đây</h2>
                <Link to="/notifications" className="text-sm text-orange-600 font-medium hover:underline">
                  Xem tất cả
                </Link>
              </div>

              {recentNotifications.length === 0 ? (
                <p className="text-sm text-gray-400">Chưa có nhắc nhở nào.</p>
              ) : (
                <ul className="space-y-3">
                  {recentNotifications.map((n) => (
                    <li key={n.id} className="text-sm">
                      <p className="text-gray-700">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(n.scheduledAt).toLocaleString('vi-VN')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
