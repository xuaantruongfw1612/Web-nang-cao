import React from 'react';
import MainLayout from '../components/MainLayout';
import DeadlineManager from '../components/DeadlineManager';

const TaskManager = () => {
  return (
    <MainLayout>
      {/* Tiêu đề của trang */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Công việc & Deadline</h2>
        <p className="text-gray-500 text-sm mt-1">Tổng hợp tất cả bài tập, đồ án và deadline cần hoàn thành.</p>
      </div>

      {/* Nhúng component bảng dữ liệu vào */}
      <DeadlineManager />
    </MainLayout>
  );
};

export default TaskManager;