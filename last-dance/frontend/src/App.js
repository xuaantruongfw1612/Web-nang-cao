import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubjectsPage from './pages/SubjectsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import StatisticsPage from './pages/StatisticsPage'; // <-- THÊM IMPORT TRANG THỐNG KÊ

import DeadlineManager from './components/DeadlineManager';
import CalendarPage from './components/CalendarPage';
import MainLayout from './components/MainLayout';

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<Protected><DeadlineManager /></Protected>} />
          <Route path="/subjects" element={<Protected><SubjectsPage /></Protected>} />
          <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />
          <Route path="/thong-ke" element={<Protected><StatisticsPage /></Protected>} /> {/* <-- THÊM ROUTE THỐNG KÊ */}
          
          <Route path="/notifications" element={<Protected><NotificationsPage /></Protected>} />
          <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}