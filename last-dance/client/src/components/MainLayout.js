import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#e8ecf1] font-sans overflow-hidden">
      
      {/* SIDEBAR TÔNG NAVY MẪU CÔ */}
      <aside className="w-[260px] bg-[#222b45] text-gray-300 flex flex-col flex-shrink-0 relative">
        {/* Logo Area */}
        <div className="p-4 flex flex-col items-center border-b border-white/10 mt-2">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
             {/* Logo đại học */}
             <span className="text-[#222b45] font-bold text-lg">PU</span>
          </div>
          <h1 className="text-white font-bold text-base tracking-wider">STUDENT</h1>
          <span className="text-xs text-gray-400">Deadline Manager</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar z-10">
          <ul className="space-y-1 text-sm">
            <li className="px-6 py-2.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
              <span className="w-4 h-4 bg-gray-400 rounded-sm"></span> Trang chủ
            </li>
            
            {/* Active Menu: Quản lý Deadline */}
            <li className="flex flex-col mt-2">
              <div className="px-6 py-2.5 bg-white/5 border-l-4 border-orange-500 text-orange-400 font-medium cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 bg-orange-400 rounded-sm"></span> Quản lý Deadline
                </div>
                <span className="text-xs">▼</span>
              </div>
              {/* Sub-menu */}
              <ul className="pl-12 py-2 space-y-3 text-xs">
                <li className="text-orange-400 font-medium flex items-center gap-2 cursor-pointer">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Danh sách công việc
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Danh mục Môn học
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* TOP HEADER */}
        <header className="h-[60px] bg-[#222b45] flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="bg-[#2d3a5d] text-sm text-gray-200 placeholder-gray-400 rounded-full pl-4 pr-10 py-1.5 w-[260px] focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="absolute right-3 top-1.5 text-gray-400">🔍</span>
            </div>
            
            {/* Notifications */}
            <button className="text-gray-300 hover:text-white">🔔</button>

            {/* User Profile */}
            <div className="flex items-center gap-2 cursor-pointer text-gray-200 hover:text-white">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                SV
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold">Sinh viên</span>
                <span className="text-[10px] text-gray-300">Quản trị viên</span>
              </div>
              <span className="text-xs">▼</span>
            </div>
          </div>
        </header>

        {/* BREADCRUMB THANH TRẮNG */}
        <div className="bg-white px-6 py-2.5 shadow-sm text-sm font-medium border-b border-gray-200">
          <span className="text-gray-500">Lịch trình</span> 
          <span className="text-gray-400 mx-2">/</span> 
          <span className="text-blue-900 font-semibold">Danh sách công việc</span>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;