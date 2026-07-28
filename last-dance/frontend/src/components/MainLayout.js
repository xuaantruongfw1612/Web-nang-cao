import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, CalendarDays, CheckSquare, BookOpen, 
  PieChart, Bell, Search, ChevronDown, ChevronRight, User, LogOut, GraduationCap 
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboard = location.pathname === '/';
  const isTasksPage = location.pathname.startsWith('/tasks');
  const isSubjectPage = location.pathname.startsWith('/subjects');
  const isStatisticsPage = location.pathname.startsWith('/statistics');
  const isCalendarPage = location.pathname.startsWith('/calendar');
  const isNotificationsPage = location.pathname.startsWith('/notifications');
  const isProfilePage = location.pathname.startsWith('/profile');
  
  const breadcrumbLabel = isDashboard ? 'Trang chủ' : isSubjectPage ? 'Danh mục Môn học'
    : isStatisticsPage ? 'Thống kê tiến độ' : isCalendarPage ? 'Lịch cá nhân'
    : isNotificationsPage ? 'Nhắc nhở' : isProfilePage ? 'Hồ sơ cá nhân'
    : isTasksPage ? 'Danh sách công việc' : '';

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <aside className="relative flex w-[260px] flex-shrink-0 flex-col bg-[#1e293b] text-slate-300 shadow-xl z-20">
        
        {/* KHU VỰC LOGO CHUẨN */}
        <div className="mt-2 flex flex-col items-center border-b border-white/5 p-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400 shadow-lg shadow-pink-500/20">
            <GraduationCap size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-white">STUDENT</h1>
          <span className="text-xs text-slate-400 font-medium">Deadline Manager</span>
        </div>
        {/* KẾT THÚC KHU VỰC LOGO */}

        <nav className="custom-scrollbar z-10 flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 text-sm font-medium">
            <li>
              <button onClick={() => navigate('/')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isDashboard ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <Home size={18} /> Trang chủ
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/calendar')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isCalendarPage ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <CalendarDays size={18} /> Lịch cá nhân
              </button>
            </li>

            <li className="mt-4 flex flex-col">
              <div className="px-6 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Học Tập
              </div>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => navigate('/tasks')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isTasksPage ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                    <CheckSquare size={18} /> Công việc
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/subjects')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isSubjectPage ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                    <BookOpen size={18} /> Môn học
                  </button>
                </li>
              </ul>
            </li>

            <li className="mt-4 flex flex-col">
              <div className="px-6 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Phân Tích
              </div>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => navigate('/statistics')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isStatisticsPage ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                    <PieChart size={18} /> Thống kê
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/notifications')} className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${isNotificationsPage ? 'text-pink-400 bg-white/5 border-r-2 border-pink-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                    <Bell size={18} /> Nhắc nhở
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="z-10 flex h-[70px] items-center justify-between bg-white px-8 shadow-sm border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="text-slate-400">Lịch trình</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-semibold text-slate-800">{breadcrumbLabel}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[260px] rounded-full bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all border border-transparent focus:border-pink-200"
              />
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
            </div>

            <button onClick={() => navigate('/notifications')} className="relative text-slate-400 hover:text-pink-500 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex cursor-pointer items-center gap-3 pl-4 border-l border-slate-200">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-pink-100" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 text-sm font-bold text-white shadow-sm">
                    {(user?.fullName || '?').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-700">{user?.fullName || 'Sinh viên'}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{user?.studentCode}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 text-sm z-20 overflow-hidden">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">
                    <User size={16} /> Hồ sơ cá nhân
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-slate-50/50">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
