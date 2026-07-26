import { useEffect, useState, useMemo } from 'react';
import { taskApi } from '../api/taskApi';

const TYPE_COLORS = {
  ASSIGNMENT: 'bg-blue-600',
  STUDY: 'bg-orange-600',
  EXAM: 'bg-red-600',
};

// Hàm lấy ngày đầu tuần (Thứ 2) với logic chuẩn để tránh lỗi nhảy ngày
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

// Hàm thêm ngày
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // TÁCH BIỆT 2 TRẠNG THÁI: Lịch Lớn (theo tuần) và Lịch Nhỏ (theo tháng)
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(new Date());

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const taskList = await taskApi.getAll();
      setTasks(taskList);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu lịch:', error);
    } finally {
      setLoading(false);
    }
  }

  // Chuyển tuần (Khung lịch lớn)
  const prevWeek = () => {
    const newDate = addDays(currentWeekStart, -7);
    setCurrentWeekStart(newDate);
    setMiniCalendarMonth(newDate); // Cập nhật cả lịch nhỏ đi theo
  };
  const nextWeek = () => {
    const newDate = addDays(currentWeekStart, 7);
    setCurrentWeekStart(newDate);
    setMiniCalendarMonth(newDate);
  };
  const goToday = () => {
    const today = new Date();
    setCurrentWeekStart(getStartOfWeek(today));
    setMiniCalendarMonth(today);
  };

  // Chuyển tháng (Chỉ tác động đến Khung lịch nhỏ)
  const prevMonth = () => {
    const d = new Date(miniCalendarMonth);
    d.setMonth(d.getMonth() - 1);
    setMiniCalendarMonth(d);
  };
  const nextMonth = () => {
    const d = new Date(miniCalendarMonth);
    d.setMonth(d.getMonth() + 1);
    setMiniCalendarMonth(d);
  };

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const hours = Array.from({ length: 24 }).map((_, i) => i);

  const tasksThisWeek = useMemo(() => {
    const endOfWeek = addDays(currentWeekStart, 7);
    return tasks.filter((t) => {
      if (!t.taskDatetime) return false;
      const d = new Date(t.taskDatetime);
      return d >= currentWeekStart && d < endOfWeek;
    });
  }, [tasks, currentWeekStart]);

  // Logic Lịch Mini dựa trên miniCalendarMonth thay vì currentWeekStart
  const miniCalendarDays = useMemo(() => {
    const currentMonth = miniCalendarMonth.getMonth();
    const currentYear = miniCalendarMonth.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = (firstDayOfMonth + 6) % 7; 

    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    return days;
  }, [miniCalendarMonth]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Lịch cá nhân
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goToday} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition">
              Hôm nay
            </button>
            <div className="flex items-center rounded-md border border-gray-200 overflow-hidden">
              <button onClick={prevWeek} className="px-2 py-1.5 bg-white hover:bg-gray-50 text-gray-500 border-r border-gray-200">
                &lsaquo;
              </button>
              <span className="px-4 py-1.5 bg-white text-sm font-medium text-gray-700 min-w-[120px] text-center">
                Tháng {currentWeekStart.getMonth() + 1}/{currentWeekStart.getFullYear()}
              </span>
              <button onClick={nextWeek} className="px-2 py-1.5 bg-white hover:bg-gray-50 text-gray-500 border-l border-gray-200">
                &rsaquo;
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Đang tải dữ liệu lịch...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                <div className="p-3 text-center border-r border-gray-200 flex flex-col justify-center">
                  <span className="text-xs text-gray-400 font-medium">Giờ VN</span>
                </div>
                {weekDays.map((day, i) => (
                  <div key={i} className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${new Date().toDateString() === day.toDateString() ? 'bg-blue-50' : ''}`}>
                    <div className="font-semibold text-gray-800">
                      {day.getDate().toString().padStart(2, '0')}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {i === 6 ? 'Chủ nhật' : `Thứ ${i + 2}`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative bg-white" style={{ height: `${hours.length * 80}px` }}>
                {hours.map((hour, idx) => (
                  <div key={hour} className="absolute w-full flex border-b border-gray-100" style={{ top: `${idx * 80}px`, height: '80px' }}>
                    <div className="w-[12.5%] border-r border-gray-200 text-center py-2 relative">
                      <span className="text-xs font-bold text-gray-600 absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-1">
                        {hour}:00
                      </span>
                    </div>
                    {Array.from({ length: 7 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex-1 border-r border-gray-100 last:border-r-0"></div>
                    ))}
                  </div>
                ))}

                {tasksThisWeek.map((task) => {
                  const dateObj = new Date(task.taskDatetime);
                  const dayIndex = (dateObj.getDay() + 6) % 7; 
                  const hour = dateObj.getHours();
                  const minute = dateObj.getMinutes();
                  
                  const topPx = hour * 80 + (minute / 60) * 80;
                  
                  return (
                    <div
                      key={task.id}
                      className="absolute p-1 z-10"
                      style={{
                        top: `${topPx}px`,
                        left: `${12.5 + dayIndex * 12.5}%`,
                        width: '12.5%',
                        height: '70px',
                      }}
                    >
                      <div className={`h-full w-full rounded-md shadow-sm border border-white/20 p-2 overflow-hidden text-white flex flex-col justify-between ${TYPE_COLORS[task.type] || 'bg-gray-600'}`}>
                        <div>
                          <div className="text-[11px] font-bold leading-tight line-clamp-2">
                            {task.title}
                          </div>
                          <div className="text-[10px] opacity-90 mt-0.5">
                            {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')} 
                            {task.room && ` • ${task.room}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-72 bg-[#425282] rounded-lg shadow-sm text-white p-5 flex flex-col h-fit">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sm">Tháng {miniCalendarMonth.getMonth() + 1}-{miniCalendarMonth.getFullYear()}</span>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded">&lsaquo;</button>
            <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded">&rsaquo;</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-white/70 font-medium mb-2">
          <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>Cn</div>
        </div>
        <div className="grid grid-cols-7 text-center text-sm gap-y-2">
          {miniCalendarDays.map((dateObj, i) => {
            if (!dateObj) return <div key={`empty-${i}`} />;
            
            const isToday = dateObj.toDateString() === new Date().toDateString();
            const endOfWeek = addDays(currentWeekStart, 7);
            const isSelectedWeek = dateObj >= currentWeekStart && dateObj < endOfWeek;

            return (
              <div key={i} className="flex justify-center">
                <span 
                  onClick={() => setCurrentWeekStart(getStartOfWeek(dateObj))}
                  className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition
                    ${isToday ? 'bg-orange-500 text-white font-bold' : 'hover:bg-white/20'}
                    ${isSelectedWeek && !isToday ? 'bg-white/10 border border-white/20' : ''}
                  `}
                >
                  {dateObj.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}