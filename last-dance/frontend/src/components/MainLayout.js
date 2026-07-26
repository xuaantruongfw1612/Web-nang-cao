import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isSubjectPage = location.pathname.startsWith('/subjects');
  const isCalendarPage = location.pathname.startsWith('/calendar');
  const isStatsPage = location.pathname.startsWith('/thong-ke'); // <-- Thêm nhận diện trang thống kê
  const isTaskPage = !isSubjectPage && !isCalendarPage && !isStatsPage; // <-- Loại trừ thêm trang thống kê

  const submenuClass = (active) =>
    `flex w-full items-center gap-2 text-left transition ${
      active
        ? 'font-medium text-orange-400'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-[#e8ecf1] font-sans">
      <aside className="relative flex w-[260px] flex-shrink-0 flex-col bg-[#222b45] text-gray-300">
        <div className="mt-2 flex flex-col items-center border-b border-white/10 p-4">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-lg font-bold text-[#222b45]">PU</span>
          </div>
          <h1 className="text-base font-bold tracking-wider text-white">
            STUDENT
          </h1>
          <span className="text-xs text-gray-400">Deadline Manager</span>
        </div>

        <nav className="custom-scrollbar z-10 flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 text-sm">
            {/* TRANG CHỦ */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isTaskPage ? 'text-orange-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isTaskPage ? 'bg-orange-400' : 'bg-gray-400'}`} />
                Trang chủ
              </button>
            </li>

            {/* LỊCH CÁ NHÂN */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/calendar')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isCalendarPage ? 'text-orange-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isCalendarPage ? 'bg-orange-400' : 'bg-gray-400'}`} />
                Lịch cá nhân
              </button>
            </li>

            {/* THỐNG KÊ (Ngang hàng Trang chủ và Lịch cá nhân) */}
            <li>
              <button
                type="button"
                onClick={() => navigate('/thong-ke')}
                className={`flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-white/10 ${isStatsPage ? 'text-orange-400 bg-white/5 font-medium' : 'text-gray-300'}`}
              >
                <span className={`h-4 w-4 rounded-sm ${isStatsPage ? 'bg-orange-400' : 'bg-gray-400'}`} />
                Thống kê
              </button>
            </li>

            {/* QUẢN LÝ DEADLINE */}
            <li className="mt-2 flex flex-col">
              <div className="flex items-center justify-between border-l-4 border-orange-500 bg-white/5 px-6 py-2.5 font-medium text-orange-400">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-sm bg-orange-400" />
                  Quản lý Deadline
                </div>
                <span className="text-xs">▼</span>
              </div>

              <ul className="space-y-3 py-2 pl-12 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className={submenuClass(isTaskPage)}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isTaskPage ? 'bg-orange-400' : 'bg-gray-400'
                      }`}
                    />
                    Danh sách công việc
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/subjects')}
                    className={submenuClass(isSubjectPage)}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSubjectPage ? 'bg-orange-400' : 'bg-gray-400'
                      }`}
                    />
                    Danh mục Môn học
                  </button>
                </li>
              </ul>
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
                className="w-[260px] rounded-full bg-[#2d3a5d] py-1.5 pl-4 pr-10 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="absolute right-3 top-1.5 text-gray-400">🔍</span>
            </div>

            <button
              type="button"
              className="text-gray-300 hover:text-white"
              aria-label="Thông báo"
            >
              🔔
            </button>

            <div className="flex cursor-pointer items-center gap-2 text-gray-200 hover:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                SV
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold">Sinh viên</span>
                <span className="text-[10px] text-gray-300">
                  Quản trị viên
                </span>
              </div>
              <span className="text-xs">▼</span>
            </div>
          </div>
        </header>

        <div className="border-b border-gray-200 bg-white px-6 py-2.5 text-sm font-medium shadow-sm">
          <span className="text-gray-500">Lịch trình</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-blue-900">
            {/* Logic hiển thị Breadcrumb cho đúng trang */}
            {isSubjectPage
              ? 'Danh mục Môn học'
              : isCalendarPage
              ? 'Lịch cá nhân'
              : isStatsPage
              ? 'Thống kê'
              : 'Danh sách công việc'}
          </span>
        </div>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;