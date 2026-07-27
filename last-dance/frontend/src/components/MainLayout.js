import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  
  // Đã gỡ bỏ isStatisticsPage khỏi mục Quản lý Deadline
  const isDeadlineSection = isTasksPage || isSubjectPage;

  const breadcrumbLabel = isDashboard
    ? 'Trang chủ'
    : isSubjectPage
    ? 'Danh mục Môn học'
    : isStatisticsPage
    ? 'Thống kê tiến độ'
    : isCalendarPage
    ? 'Lịch cá nhân'
    : isNotificationsPage
    ? 'Nhắc nhở'
    : isProfilePage
    ? 'Hồ sơ cá nhân'
    : isTasksPage
    ? 'Danh sách công việc'
    : '';

  const submenuClass = (active) =>
    `flex w-full items-center gap-2 text-left transition ${
      active ? 'font-medium text-pink-400' : 'text-gray-300 hover:text-white'
    }`;

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#e8ecf1] font-sans">
      <aside className="relative flex w-[260px] flex-shrink-0 flex-col bg-[#222b45] text-gray-300">
        <div className="mt-2 flex flex-col items-center border-b border-white/10 p-4">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-lg font-bold text-[#222b45]">PU</span>
          </div>
          <h1 className="text-base font-bold tracking-wider text-white">STUDENT</h1>
          <span className="text-xs text-gray-400">Deadline Manager</span>
        </div>

        <nav className="custom-scrollbar z-10 flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 text-sm">
            {/* TRANG CHỦ (Dashboard) */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isDashboard ? 'text-pink-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isDashboard ? 'bg-pink-400' : 'bg-gray-400'}`} />
                Trang chủ
              </button>
            </li>

            {/* LỊCH CÁ NHÂN */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/calendar')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isCalendarPage ? 'text-pink-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isCalendarPage ? 'bg-pink-400' : 'bg-gray-400'}`} />
                Lịch cá nhân
              </button>
            </li>

            {/* QUẢN LÝ DEADLINE (submenu) */}
            <li className="mt-2 flex flex-col">
              <div
                className={`flex items-center justify-between border-l-4 px-6 py-2.5 font-medium ${
                  isDeadlineSection ? 'border-pink-500 bg-white/5 text-pink-400' : 'border-transparent text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-sm ${isDeadlineSection ? 'bg-pink-400' : 'bg-gray-400'}`} />
                  Quản lý Deadline
                </div>
                <span className="text-xs">▼</span>
              </div>

              <ul className="space-y-3 py-2 pl-12 text-xs">
                <li>
                  <button type="button" onClick={() => navigate('/tasks')} className={submenuClass(isTasksPage)}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isTasksPage ? 'bg-pink-400' : 'bg-gray-400'}`} />
                    Danh sách công việc
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/subjects')} className={submenuClass(isSubjectPage)}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isSubjectPage ? 'bg-pink-400' : 'bg-gray-400'}`} />
                    Danh mục Môn học
                  </button>
                </li>
              </ul>
            </li>

            {/* THỐNG KÊ (Đã đưa ra ngoài) */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/statistics')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isStatisticsPage ? 'text-pink-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isStatisticsPage ? 'bg-pink-400' : 'bg-gray-400'}`} />
                Thống kê
              </button>
            </li>

            {/* NHẮC NHỞ */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isNotificationsPage ? 'text-pink-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isNotificationsPage ? 'bg-pink-400' : 'bg-gray-400'}`} />
                Nhắc nhở
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="z-10 flex h-[60px] items-center justify-between bg-[#222b45] px-6 shadow-sm">
          <div className="flex-1" />

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[260px] rounded-full bg-[#2d3a5d] py-1.5 pl-4 pr-10 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              <span className="absolute right-3 top-1.5 text-gray-400">🔍</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="text-gray-300 hover:text-white"
              aria-label="Nhắc nhở"
            >
              🔔
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-2 text-gray-200 hover:text-white"
              >
                {user?.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full object-cover shadow-sm border border-gray-200"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                    {(user?.fullName || '?').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold">{user?.fullName || 'Sinh viên'}</span>
                  <span className="text-[10px] text-gray-300">{user?.studentCode}</span>
                </div>
                <span className="text-xs">▼</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm text-gray-700 z-20">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="border-b border-gray-200 bg-white px-6 py-2.5 text-sm font-medium shadow-sm">
          <span className="text-gray-500">Lịch trình</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-pink-600">{breadcrumbLabel}</span>
        </div>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;