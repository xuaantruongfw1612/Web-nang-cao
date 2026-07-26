import { useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    setSavingProfile(true);
    try {
      const updated = await authApi.updateProfile(profileForm);
      setUser(updated);
      setProfileMsg('Đã cập nhật hồ sơ');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Không cập nhật được hồ sơ');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwMsg('');
    setPwError('');
    setSavingPw(true);
    try {
      await authApi.changePassword(pwForm);
      setPwMsg('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      setPwForm({ oldPassword: '', newPassword: '' });
      setTimeout(() => logout(), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đổi mật khẩu thất bại';
      setPwError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4 pb-4 border-b border-gray-100">Hồ sơ cá nhân</h2>

        <div className="mb-4 text-sm text-gray-500 space-y-1">
          <p><span className="text-gray-400">Mã sinh viên:</span> {user?.studentCode}</p>
          <p><span className="text-gray-400">Email:</span> {user?.email}</p>
        </div>

        {profileMsg && <p className="mb-3 text-sm text-green-700">{profileMsg}</p>}
        {profileError && <p className="mb-3 text-sm text-red-600">{profileError}</p>}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Ảnh đại diện (URL)
            </label>
            <input
              type="text"
              value={profileForm.avatarUrl}
              onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
          >
            {savingProfile ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4 pb-4 border-b border-gray-100">Đổi mật khẩu</h2>

        {pwMsg && <p className="mb-3 text-sm text-green-700">{pwMsg}</p>}
        {pwError && <p className="mb-3 text-sm text-red-600">{pwError}</p>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={pwForm.oldPassword}
              onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={savingPw}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
          >
            {savingPw ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
