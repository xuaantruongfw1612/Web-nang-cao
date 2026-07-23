import React, { useState } from 'react';

const DeadlineManager = () => {
  const [deadlines] = useState([
    { id: 1, name: 'Hoàn thiện file báo cáo', type: 'ASSIGNMENT', dueDate: '2026-07-25', status: 'PENDING' },
    { id: 2, name: 'Ôn tập chương 3 & 4', type: 'STUDY', dueDate: '2026-07-28', status: 'COMPLETED' },
    { id: 3, name: 'Thi giữa kỳ', type: 'EXAM', dueDate: '2026-08-05', status: 'PENDING' },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      
      {/* BỘ LỌC VÀ NÚT THÊM */}
      <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Lọc theo loại
          </label>
          <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-[200px] focus:outline-none focus:border-blue-500 text-gray-700">
            <option value="ALL">Tất cả</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="STUDY">Study</option>
            <option value="EXAM">Exam</option>
          </select>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition">
          + Thêm Deadline mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH (TABLE) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-center w-16">STT</th>
              <th className="px-4 py-3">Tên công việc</th>
              <th className="px-4 py-3 text-center">Loại</th>
              <th className="px-4 py-3 text-center">Hạn chót</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deadlines.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-center text-gray-500 font-medium">{index + 1}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{item.name}</td>
                
                {/* Badge Loại */}
                <td className="px-4 py-4 text-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase ${
                    item.type === 'ASSIGNMENT' ? 'bg-purple-100 text-purple-700' :
                    item.type === 'STUDY' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.type}
                  </span>
                </td>

                <td className="px-4 py-4 text-center text-gray-600">{item.dueDate}</td>
                
                {/* Badge Trạng thái */}
                <td className="px-4 py-4 text-center">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
                    item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>

                {/* Nút Thao tác */}
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <button className="text-blue-600 hover:underline font-medium">Sửa</button>
                    <button className="text-red-500 hover:underline font-medium">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeadlineManager;