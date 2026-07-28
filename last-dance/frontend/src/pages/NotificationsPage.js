import { useEffect, useState, useMemo } from 'react';
import { notificationApi } from '../api/notificationApi';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Bell, Loader2, BellOff, Clock, FileDown } from 'lucide-react';

const STATUS_BADGE = { PENDING: 'yellow', SENT: 'green', FAILED: 'red', CANCELLED: 'slate' };
const STATUS_LABEL = { PENDING: 'Chờ gửi', SENT: 'Đã gửi', FAILED: 'Gửi lỗi', CANCELLED: 'Đã huỷ' };

export default function NotificationsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States cho Lọc, Xếp và Xuất
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC'); // DESC: Mới nhất xuống cũ nhất
  const [isExporting, setIsExporting] = useState(false);

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

  // Hàm xử lý xuất báo cáo
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('🎉 Xuất báo cáo nhắc nhở thành công!');
    }, 2000);
  };

  // Logic Lọc và Sắp xếp
  const filteredAndSortedLogs = useMemo(() => {
    let result = statusFilter === 'ALL' ? [...logs] : logs.filter((log) => log.status === statusFilter);
    
    result.sort((a, b) => {
      const timeA = new Date(a.scheduledAt).getTime();
      const timeB = new Date(b.scheduledAt).getTime();
      return sortOrder === 'ASC' ? timeA - timeB : timeB - timeA;
    });
    
    return result;
  }, [logs, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch sử nhắc nhở"
        subtitle="Hệ thống tự động tạo nhắc nhở khi công việc sắp đến hạn và gửi email đúng giờ đã lên lịch."
      />

      <Card className="p-6">
        {/* KHU VỰC CÔNG CỤ: LỌC, XẾP, XUẤT */}
        <div className="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-slate-100 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-700 transition-all cursor-pointer"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Chờ gửi</option>
                <option value="SENT">Đã gửi</option>
                <option value="FAILED">Gửi lỗi</option>
                <option value="CANCELLED">Đã huỷ</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Thời gian gửi
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-700 transition-all cursor-pointer"
              >
                <option value="DESC">Mới nhất</option>
                <option value="ASC">Cũ nhất</option>
              </select>
            </div>
          </div>

          <div className="flex items-end h-full mt-auto">
            <Button 
              variant="secondary" 
              onClick={handleExportReport}
              disabled={isExporting}
              className="text-slate-600 bg-white border-slate-200 hover:bg-slate-50 shadow-sm"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <FileDown size={16} className="text-slate-500" />
              )}
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* CÁC TRẠNG THÁI LOADING / ERROR / EMPTY */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3 text-sm text-slate-500 font-medium">
            <Loader2 size={24} className="animate-spin text-pink-500" />
            Đang tải dữ liệu nhắc nhở...
          </div>
        )}

        {error && (
          <div className="py-4 text-center text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && filteredAndSortedLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <BellOff size={40} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">
              {logs.length === 0 ? 'Chưa có nhắc nhở nào được lên lịch.' : 'Không tìm thấy nhắc nhở nào phù hợp với bộ lọc.'}
            </p>
            {logs.length === 0 && (
              <p className="text-xs text-slate-400 mt-1">Hệ thống sẽ tự động tạo nhắc nhở khi bạn có deadline sắp tới.</p>
            )}
          </div>
        )}

        {/* BẢNG DỮ LIỆU */}
        {!loading && filteredAndSortedLogs.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-4 w-16 text-center">STT</th>
                  <th className="px-5 py-4">Nội dung nhắc nhở</th>
                  <th className="px-5 py-4 text-center">Thời điểm gửi</th>
                  <th className="px-5 py-4 text-center">Trạng thái</th>
                  <th className="px-5 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${log.status === 'PENDING' ? 'bg-amber-50 text-amber-500' : log.status === 'SENT' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                          <Bell size={16} />
                        </div>
                        <p className="font-medium text-slate-700 leading-relaxed group-hover:text-pink-600 transition-colors">
                          {log.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium text-xs">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(log.scheduledAt).toLocaleString('vi-VN', {
                          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge color={STATUS_BADGE[log.status] || 'gray'}>
                        {STATUS_LABEL[log.status] || log.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {log.status === 'PENDING' ? (
                        <button
                          onClick={() => handleCancel(log)}
                          className="text-rose-500 hover:text-rose-700 hover:underline font-semibold text-sm transition-colors"
                        >
                          Huỷ lịch
                        </button>
                      ) : (
                        <span className="text-slate-300 text-sm font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
