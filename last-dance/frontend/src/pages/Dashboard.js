import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { ClipboardList, Clock, AlertCircle, CheckCircle2, Bell } from 'lucide-react';

const STATUS_BADGE = { PENDING: 'yellow', IN_PROGRESS: 'blue', COMPLETED: 'green', OVERDUE: 'red', CANCELLED: 'gray' };
const STATUS_LABEL = {
  PENDING: 'Chưa làm',
  IN_PROGRESS: 'Đang làm',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã huỷ',
};

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
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Xin chào, {displayName} 👋</h1>
        <p className="text-sm text-slate-500 mt-1 capitalize font-medium">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          Đang tải dữ liệu...
        </div>
      )}
      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Tổng công việc" value={stats.total} icon={<ClipboardList size={22} />} color="pink" />
            <StatCard label="Sắp tới (7 ngày)" value={stats.upcoming7d} icon={<Clock size={22} />} color="blue" />
            <StatCard label="Quá hạn" value={stats.overdue} icon={<AlertCircle size={22} />} color="red" />
            <StatCard label="Hoàn thành" value={stats.completed} icon={<CheckCircle2 size={22} />} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Deadline sắp tới</h2>
                <Link to="/tasks" className="text-sm text-pink-600 font-semibold hover:text-pink-700 hover:underline transition-colors">
                  Xem tất cả
                </Link>
              </div>

              {upcomingList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">Tuyệt vời! Không có deadline nào sắp tới. 🎉</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {upcomingList.map((t) => (
                    <li key={t.id} className="py-3.5 flex items-center justify-between gap-3 group">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-700 text-sm truncate group-hover:text-pink-600 transition-colors">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(t.taskDatetime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                          {isOverdue(t) && <span className="text-rose-500 font-bold ml-1 bg-rose-50 px-1.5 py-0.5 rounded">QUÁ HẠN</span>}
                        </p>
                      </div>
                      <Badge color={STATUS_BADGE[t.status] || 'gray'}>{STATUS_LABEL[t.status] || t.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Nhắc nhở</h2>
                <Link to="/notifications" className="text-sm text-orange-500 font-semibold hover:text-orange-600 hover:underline transition-colors">
                  Xem tất cả
                </Link>
              </div>

              {recentNotifications.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium bg-slate-50 p-4 rounded-lg text-center border border-dashed border-slate-200">Chưa có nhắc nhở nào.</p>
              ) : (
                <ul className="space-y-4">
                  {recentNotifications.map((n) => (
                    <li key={n.id} className="text-sm flex gap-3 items-start">
                      <div className="mt-0.5 p-1.5 bg-orange-50 text-orange-500 rounded-lg shrink-0">
                        <Bell size={14} />
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium leading-relaxed">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          {new Date(n.scheduledAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </p>
                      </div>
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
