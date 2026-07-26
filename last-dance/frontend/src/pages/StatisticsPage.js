import { useEffect, useState, useMemo } from 'react';
import { taskApi } from '../api/taskApi'; // Thay bằng đường dẫn API thực tế của bạn

export default function StatisticsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      // Gọi API lấy toàn bộ task của user
      const taskList = await taskApi.getAll();
      setTasks(taskList);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thống kê:', error);
    } finally {
      setLoading(false);
    }
  }

  // Xử lý logic thống kê: Áp dụng phương án TOÀN BỘ CÔNG VIỆC
  const stats = useMemo(() => {
    const now = new Date();
    
    // Tổng số task hiện có
    const total = tasks.length;
    
    // Đếm số lượng HOÀN THÀNH (Bắt cả các trường hợp viết hoa/viết thường để chống lỗi)
    const completed = tasks.filter(t => 
      t.status === 'HOÀN THÀNH' || 
      t.status === 'Hoàn thành' || 
      t.status === 'COMPLETED'
    ).length;
    
    // Missed = Những task đã bị đánh dấu là 'QUÁ HẠN' hoặc 'CHƯA LÀM' nhưng thời gian deadline đã vượt quá thời gian hiện tại
    const missed = tasks.filter(t => 
      t.status === 'QUÁ HẠN' || 
      t.status === 'OVERDUE' ||
      ((t.status === 'CHƯA LÀM' || t.status === 'Chưa làm' || t.status === 'PENDING') && new Date(t.taskDatetime) < now)
    ).length;

    // Các task còn lại (Đang làm, chưa tới hạn...)
    const other = total - completed - missed;

    // Tính tỷ lệ phần trăm hoàn thành
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, missed, other, completionRate };
  }, [tasks]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[80vh] p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">Thống kê tiến độ</h2>
        <p className="text-sm text-gray-500 mt-1">Tổng quan toàn bộ Deadline của bạn</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="space-y-8">
          {/* Hàng thẻ thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tổng số */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">TỔNG DEADLINE</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
            </div>

            {/* Card 2: Hoàn thành */}
            <div className="bg-green-50 border border-green-100 p-5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">ĐÃ HOÀN THÀNH</p>
                <h3 className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</h3>
              </div>
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>

            {/* Card 3: Bị trễ (Missed) */}
            <div className="bg-red-50 border border-red-100 p-5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold">BỎ LỠ / TRỄ HẠN</p>
                <h3 className="text-3xl font-bold text-red-900 mt-1">{stats.missed}</h3>
              </div>
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>

          {/* Thanh tiến độ */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
            <h4 className="text-gray-700 font-semibold mb-4">Tỷ lệ hoàn thành mục tiêu</h4>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  stats.completionRate >= 80 ? 'bg-green-500' : 
                  stats.completionRate >= 50 ? 'bg-yellow-400' : 'bg-red-500'
                }`} 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>0%</span>
              <span className="font-bold text-gray-700">{stats.completionRate}% Đạt được</span>
              <span>100%</span>
            </div>
            
            {stats.total === 0 && (
              <p className="text-sm text-gray-400 mt-3 text-center italic">Chưa có dữ liệu task nào trong hệ thống.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}